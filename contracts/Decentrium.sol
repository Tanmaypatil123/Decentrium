pragma solidity ^0.5.0;

contract Decentrium {
    string public name;
    uint256 public BlogCount = 0;
    mapping(uint256 => Blog) public blogs;

    struct Blog{
        uint256 id;
        string hash;
        string description;
        uint256 tipAmount;
        address payable author;
    }

    event blogCreated(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author
    );

    event blogTipped(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author
    );

    constructor() public {
        name = "Decentrium";
    }
    function uploadBlog(string memory _blogHash, string memory _description) public {
    require(bytes(_blogHash).length > 0);

    require(bytes(_description).length > 0);

    require(msg.sender!=address(0));


    BlogCount ++;


    blogs[BlogCount] = Blog(BlogCount, _blogHash, _description, 0, msg.sender);

    emit blogCreated(BlogCount, _blogHash, _description, 0, msg.sender);
  }

  function tipBlogOwner(uint _id) public payable {

    require(_id > 0 && _id <= BlogCount);

    Blog memory _blog = blogs[_id];

    address payable _author = _blog.author;

    address(_author).transfer(msg.value);

    _blog.tipAmount = _blog.tipAmount + msg.value;

    blogs[_id] = _blog;

    emit blogTipped(_id, _blog.hash, _blog.description, _blog.tipAmount, _author);
  }
}