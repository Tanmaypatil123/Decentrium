import React, { Component } from "react";
import { Form, Button, Input, Message} from "semantic-ui-react";
import Layout from "../../components/Layout";
import web3 from "../../web3";
import Decentrium from "../../build/contracts/Decentrium.json";
import { useRouter } from "next/router";
const { add } = require("../config");
class NewBlog extends Component{
    constructor(props){
      super(props);
      this.state = {
        errorMessage:"",
        BlogTitle:"",
        BlogDescription:"",
        loading:false,
        decentrium:null
      }
    }
    onSubmit=async (event) => {
      event.preventDefault();
      this.setState({ loading: true, errorMessage: "" });
      try{const accounts=await web3.eth.getAccounts();
        const decentrium = new web3.eth.Contract(Decentrium.abi, `${add}`);
        this.setState({decentrium})
        this.setState({loading:true})
        await decentrium.methods.uploadBlog(this.state.BlogDescription,this.state.BlogTitle).send({from:accounts[0]})
      }catch(err){
        this.setState({ errorMessage: err.message });
      }
      this.setState({loading:false})
    }
    render(){
        return (
          <Layout>
            <h3>Create a new blog</h3>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Blog Title</label>
                <Input
                  value={this.state.BlogTitle}
                  onChange={(event) =>
                    this.setState({ BlogTitle: event.target.value })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Blog Content</label>
                <Input
                  value={this.state.BlogDescription}
                  onChange={(event) =>
                    this.setState({ BlogDescription: event.target.value })
                  }
                />
              </Form.Field>
              <Message error header="OOPS!" content={this.state.errorMessage} />
              <Button loading={this.state.loading} primary>
                Create!
              </Button>
            </Form>
          </Layout>
        );
    }
}
export default NewBlog;