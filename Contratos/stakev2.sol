
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;



import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SpeciesCoin is  Ownable, ERC721Holder {


    uint256 public numberOfBlocksPerRewardUnit;
    uint256 public amountOfStakers;
    uint256 public tokensStaked;
    uint256 immutable public contractCreationBlock;
    IERC20 public TokenExchange;
    IERC20 public TokenReward;
    struct StakeInfo {
        uint256 stakedAtBlock;
        uint256 lastHarvestBlock;
        address AddColle;
        bool currentlyStaked;
        uint256[] Trait;

    }

    struct CollectionInfo {
        bool isActive;
        uint256 reward;
        address AddCollection;
        uint256[] _id;
    }

    struct _traitSpecial {
        uint256 trait1;
        uint256 trait2;
        uint256 trait3;
    
    }

    /// owner => tokenId => StakeInfo
    //mapping (address =>  mapping(uint256 => StakeInfo)) public stakeLog;

    mapping (address => mapping(address => mapping(uint256 => StakeInfo))) public stakeLog;

    //colecciton->id->owner
    mapping (address => mapping(uint256 => address)) public ownerId;

    /// owner => #NFTsStaked
    mapping (address => uint256) public tokensStakedByUser;

    mapping (address => uint256) public pointUser;

    /// owner and collection => list of all tokenIds that the user has staked
    mapping (address =>  mapping (address =>  uint256[])) public stakePortfolioByUser;
    /// tokenId => indexInStakePortfolio
    mapping(address => mapping (uint256 =>  uint256)) public indexOfTokenIdInStakePortfolio;
    //
    mapping (address => CollectionInfo) public AddressCollection;
    mapping (address => _traitSpecial) public traitSpecial;

    //mapping (address => nftUserInfo) public UserInfo;


    event RewardsHarvested (address owner, uint256 amount);
    event NFTStaked (address owner, uint256 tokenId);
    event NFTUnstaked (address owner, uint256 tokenId);

    constructor( IERC20 _TokenExchange, IERC20 _TokenReward ){
        TokenExchange = _TokenExchange;
        TokenReward = _TokenReward;
        contractCreationBlock = block.number;
        //coinAmountPerRewardUnit = 400 * 10 ** 18; // 10 ERC20 coins per rewardUnit, may be changed later on
        numberOfBlocksPerRewardUnit = 1; // 12 hours per reward unit , may be changed later on
     }

    function stakedNFTSByUser(address _collection) external view returns (uint256[] memory){
        return stakePortfolioByUser[_msgSender()][_collection];
    }


    function pendingRewards(address owner, uint256 tokenId, address _collection) public view returns (uint256){
        StakeInfo memory info = stakeLog[owner][_collection][tokenId];
        CollectionInfo memory infoC = AddressCollection[_collection];
        _traitSpecial memory _trait = traitSpecial[_collection];
        uint256 TotalRewards;
        uint256 SpeciaRewards;
        uint256 coin = 0;
        if(info.lastHarvestBlock < contractCreationBlock || info.currentlyStaked == false) {
            return 0;
        }
        uint256 blocksPassedSinceLastHarvest = block.number - info.lastHarvestBlock;
        if (blocksPassedSinceLastHarvest < numberOfBlocksPerRewardUnit * 2) {
            return 0;
        }

        uint256 rewardAmount = blocksPassedSinceLastHarvest / numberOfBlocksPerRewardUnit - 1;
        TotalRewards = rewardAmount * infoC.reward;
        for(uint256 i = 0; i < info.Trait.length; i++){
            if( keccak256(abi.encodePacked(info.Trait[i])) == keccak256(abi.encodePacked(_trait.trait1)) ){
                coin = 1;
            }
            if( keccak256(abi.encodePacked(info.Trait[i])) == keccak256(abi.encodePacked(_trait.trait1)) || keccak256(abi.encodePacked(info.Trait[i])) == keccak256(abi.encodePacked(_trait.trait2)) ){
                coin = 2;
            }
            if( keccak256(abi.encodePacked(info.Trait[i])) == keccak256(abi.encodePacked(_trait.trait1)) || keccak256(abi.encodePacked(info.Trait[i])) == keccak256(abi.encodePacked(_trait.trait2)) || keccak256(abi.encodePacked(info.Trait[i])) == keccak256(abi.encodePacked(_trait.trait3))  ){
                coin = 3;
            }
        }

        if(coin == 1){
            SpeciaRewards =  (TotalRewards * 50) / 100;
        }if(coin == 2){
            SpeciaRewards =  (TotalRewards * 150) / 100;
        }if(coin == 3){
            SpeciaRewards =  (TotalRewards * 200) / 100;
        }
        

        return TotalRewards + SpeciaRewards;

    }

    function SaveRewards(address owner, uint256 tokenId, address _collection)public  returns (bool){
        StakeInfo storage info = stakeLog[owner][_collection][tokenId];
        CollectionInfo memory infoC = AddressCollection[_collection];

        require(infoC.isActive == true, "Collection does not exist");
        
        uint256 reward = pendingRewards(owner, tokenId, _collection);
        info.lastHarvestBlock = block.number;
        pointUser[owner] = reward + pointUser[owner];
        return true;

    }
    function payEverything(address owner, uint256 tokenId, address _collection) internal {
       StakeInfo storage info = stakeLog[owner][_collection][tokenId];
        
       uint256 _reward = pendingRewards(owner, tokenId, _collection);

       TokenExchange.transfer(msg.sender, pointUser[owner]+_reward);


       info.lastHarvestBlock = block.number;
       pointUser[owner] = 0; 
    }

    function AllSavePoint( address _collection )public returns(bool){

        CollectionInfo memory infoC = AddressCollection[_collection];

        require(infoC.isActive == true, "Collection does not exist");
        for(uint256 currentId = 0; currentId < infoC._id.length; currentId++){

            SaveRewards(ownerId[_collection][infoC._id[currentId]], infoC._id[currentId], _collection);
        }

        return true;
    }

    function Isdueno(address add, uint256 _id)public view returns (address){

        return ownerId[add][_id];
    }

    function stake(uint256 tokenId, address _collection,uint256[] memory _trait)  public returns (bool){
        
        CollectionInfo storage infoC = AddressCollection[_collection];
        
        require(infoC.isActive == true,
            "Collection does not exist");


  
       require(IERC721(_collection).ownerOf(tokenId) != address(this), "Stake: Token is already staked in this contract");


       IERC721(_collection).safeTransferFrom(msg.sender, address(this), tokenId);
        
        require(IERC721(_collection).ownerOf(tokenId) == address(this), "Stake: Failed to take possession of NFT");

        TokenExchange.transfer(msg.sender, 1 ether);
        StakeInfo storage info = stakeLog[_msgSender()][_collection][tokenId];

        ownerId[_collection][tokenId] = msg.sender;
        infoC._id.push(tokenId);
        info.AddColle = _collection;
        info.stakedAtBlock = block.number;
        info.lastHarvestBlock = block.number;
        info.currentlyStaked = true;
        for(uint256 i = 0; i < _trait.length; i++){
            info.Trait.push(_trait[i]);
        }

        if(tokensStakedByUser[_msgSender()] == 0){
            amountOfStakers += 1;
        }
        tokensStakedByUser[_msgSender()] += 1;
        tokensStaked += 1;
        stakePortfolioByUser[_msgSender()][_collection].push(tokenId);
        uint256  indexOfNewElement = stakePortfolioByUser[_msgSender()][_collection].length - 1;
        indexOfTokenIdInStakePortfolio[_collection][tokenId] = indexOfNewElement;


        // if(!welcomeBonusCollected[tokenId]) {
        //     _mint(_msgSender(), welcomeBonusAmount);
        //     welcomeBonusCollected[tokenId] = true;
        // }

        emit NFTStaked(_msgSender(), tokenId);
        return true;
    }

    // function stakeBatch(uint256[] memory tokenIds,address _collection,uint256[] memory _trait) external {
    //     for(uint currentId = 0; currentId < tokenIds.length; currentId++) {
    //         if(tokenIds[currentId] == 0) {
    //             continue;
    //         }

    //         stake(tokenIds[currentId], _collection,_trait);
    //     }
    // }

    // function unstakeBatch(uint256[] memory tokenIds, address _collection) external {
    //     for(uint currentId = 0; currentId < tokenIds.length; currentId++) {
    //         if(tokenIds[currentId] == 0) {
    //             continue;
    //         }
    //         unstake(tokenIds[currentId], _collection);
    //     }
    // }

    function unstake(uint256 tokenId, address _collection) public {
        if(pendingRewards(_msgSender(), tokenId, _collection) > 0){
            harvest(tokenId, _collection);
        }
        StakeInfo storage info = stakeLog[_msgSender()][_collection][tokenId];
        info.currentlyStaked = false;
        IERC721(_collection).safeTransferFrom(address(this), _msgSender(), tokenId);
        require(IERC721(_collection).ownerOf(tokenId) == _msgSender(),
            "SPCC: Error while transferring token");
        if(tokensStakedByUser[_msgSender()] == 1){
            amountOfStakers -= 1;
        }
        tokensStakedByUser[_msgSender()] -= 1;
        tokensStaked -= 1;
        stakePortfolioByUser[_msgSender()][_collection][indexOfTokenIdInStakePortfolio[_collection][tokenId]] = 0;
        emit NFTUnstaked(_msgSender(), tokenId);
    }

    function harvest(uint256 tokenId, address _collection) public {
        
        uint256 rewardAmountInERC20Tokens = pendingRewards(_msgSender(), tokenId, _collection) + pointUser[_msgSender()];
        if(rewardAmountInERC20Tokens > 0) {
            payEverything(_msgSender(), tokenId, _collection);
            emit RewardsHarvested(_msgSender(), rewardAmountInERC20Tokens);
        }
    }

    function harvestBatch(address user, address _collection) external {
        uint256[] memory tokenIds = stakePortfolioByUser[user][_collection];

        for(uint currentId = 0; currentId < tokenIds.length; currentId++) {
            if(tokenIds[currentId] == 0) {
                continue;
            }
            harvest(tokenIds[currentId], _collection);
        }
    }

    // ADMIN / SETTER FUNCTIONS
    function setNumberOfBlocksPerRewardUnit(uint256 numberOfBlocks) external onlyOwner{
        numberOfBlocksPerRewardUnit = numberOfBlocks;
    }

    function setIdCollection(address _collection) public view returns( uint256[] memory){
        CollectionInfo memory infoC = AddressCollection[_collection];

        return infoC._id; 

    }
    function setCollection(address _collection, uint256 reward)public onlyOwner{
        CollectionInfo storage infoC = AddressCollection[_collection];
        infoC.isActive = true;
        infoC.reward = reward * 10 ** 18;
        infoC.AddCollection = _collection;
    }

    function setTraitSpecial(address _collection ,uint256 _trait1, uint256 _trait2, uint256 _trait3)public onlyOwner{
        _traitSpecial storage traits = traitSpecial[_collection];
        traits.trait1 = _trait1;
        traits.trait2 = _trait2;
        traits.trait3 = _trait3;
    }

    function setTokenExchangeAddress(IERC20 newAddress) external onlyOwner{
       // require (newAddress != address(0), "update to zero address not possible");
        TokenExchange = newAddress;
    }

    function setTokenRewardAddress(IERC20 newAddress) external onlyOwner{
       // require (newAddress != address(0), "update to zero address not possible");
        TokenReward = newAddress;
    }

}   