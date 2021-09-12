import Decentrium from "../build/contracts/Decentrium.json";
import React, { Component } from "react";
import { Button, Card, CardDescription, CardHeader } from "semantic-ui-react";
import web3 from "../web3";
import Layout from "../components/Layout";
const {add} = require("../config");
class App extends Component {
  async componentDidMount() {
    await this.getBlogs();
  }
  async getBlogs() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const decentrium = new web3.eth.Contract(
      Decentrium.abi,`${add}`
    );
    this.setState({decentrium})
    
    const blogCount = await decentrium.methods.BlogCount().call();
    this.setState({ blogCount });
    for (var i = 1; i <= blogCount; i++) {
      const blog = await decentrium.methods.blogs(i).call();
      this.setState({
        blogs: [...this.state.blogs, blog],
      });
    }
  }

  tipBlogOwner(id, tipamount) {
    this.setState({ loading: true });
    this.state.decentrium.methods
      .tipBlogOwner(id)
      .send({ from: this.state.account, value: tipamount })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  }
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      decentrium:null,
      blogs: [],
      loading: true,
      fluid:true
    };
    this.tipBlogOwner = this.tipBlogOwner.bind(this);
  }
  render() {
    return (
      <Layout>
        <h3>Blogs</h3>
        {this.state.blogs.map((blog,key)=>{
          return (
            <Card
              key={key}
              fluid={this.state.fluid}
            >
              <Card.Content>
                <Card.Header>{blog.description}</Card.Header>
                <Card.Meta>{blog.author}</Card.Meta>
                <CardDescription>{blog.hash}</CardDescription>
              </Card.Content>
              <Card.Content extra>
                <Button
                  name={blog.id}
                 onClick={(event)=>{
                  let tipAmount = web3.utils.toWei("0.1", "Ether");
                  this.tipBlogOwner(event.target.name, tipAmount);
                }}>TIP 0.1 ETH</Button>
              </Card.Content>
            </Card>
          );
        })}
      </Layout>
    );
  }
}
export default App;
