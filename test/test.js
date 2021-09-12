const { assert } = require("chai");
const Decentrium = artifacts.require("Decentrium");
require("chai").use(require("chai-as-promised")).should();
contract("Decentrium", ([deployer, author, tipper])=>{
    let decentrium ;
    before(async () => {
        decentrium = await Decentrium.deployed()
    })
    describe("deployment", async () => {
        it("deployes the contract" , async () => {
            const address = await decentrium.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        })
        it("has a name" , async () => {
            const name = await decentrium.name()
            assert.equal(name, "Decentrium");
        })
    })
    describe('Blog',async () =>{
        let result , blogCount;
        const hash = "QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb";
        before(async()=>{
            result = await decentrium.uploadBlog(hash,"Blog description",{from:author});
            blogCount = await decentrium.BlogCount()
        })
        it('creates blog', async()=> {
            assert.equal(blogCount,1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(),blogCount.toNumber(),'id is correct')
            assert.equal(event.hash,hash,'hash is correct')
            assert.equal(event.description, "Blog description","description is correct")
            assert.equal(event.tipAmount,0,"tip amount is matched")
            assert.equal(event.author,author,'author is correct')


            await decentrium.uploadBlog("", "Blog description",{from:author}).should.be.rejected;
            await decentrium.uploadBlog("blog hash",'',{from:author}).should.be.rejected;
        })
        it('lists blogs',async () => {
            const blog = await decentrium.blogs(blogCount);
            assert.equal(blog.id.toNumber() , blogCount.toNumber(),'blog count is correct')
            assert.equal(blog.hash,hash,'hash is correct')
            assert.equal(blog.description, "Blog description",'description is correct')
            assert.equal(blog.tipAmount,0,'tip amount is correct')
            assert.equal(blog.author,author,'author is correct')
        })
        it("allows user to tip",async () => {
            let oldAuthorBalance ;
            oldAuthorBalance = await web3.eth.getBalance(author);
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);
            result = await decentrium.tipBlogOwner(blogCount,{from:tipper,value:web3.utils.toWei('1','Ether')});
            const event = result.logs[0].args
            assert.equal(
              event.id.toNumber(),
              blogCount.toNumber(),
              "id is correct"
            );
            assert.equal(event.hash, hash, "hash is correct");
            assert.equal(
              event.description,
              "Blog description",
              "description is correct"
            );
            assert.equal(
              event.tipAmount,
              "1000000000000000000",
              "tip amount is matched"
            );
            assert.equal(event.author, author, "author is correct");
            let newAuthorBalance;
            newAuthorBalance = await web3.eth.getBalance(author);
            newAuthorBalance = new web3.utils.BN(newAuthorBalance);

            let tipImageOwner;
            tipImageOwner = web3.utils.toWei("1", "Ether");
            tipImageOwner = new web3.utils.BN(tipImageOwner);

            const expectedBalance = oldAuthorBalance.add(tipImageOwner);

            assert.equal(
              newAuthorBalance.toString(),
              expectedBalance.toString()
            );

            await decentrium.tipBlogOwner(99, {
              from: tipper,
              value: web3.utils.toWei("1", "Ether"),
            }).should.be.rejected;
        })
    })
});