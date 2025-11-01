import React, { Component } from 'react';
import './DatabaseDemo.css';

class DatabaseDemo extends Component {
  backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      text_amt: "",
      text_desc: ""
    };
  }

  componentDidMount() {
    this.populateData();
  }

  async fetchRetry(url, n) {
    try {
      const res = await fetch(url);
      return res;
    } catch (err) {
      if (n === 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.fetchRetry(url, n - 1);
    }
  }

  async populateData() {
    try {
      const res = await this.fetchRetry(`${this.backendUrl}/transaction`, 3);
      const data = await res.json();
      const transactions = data.result || data.data || [];
      this.setState({ transactions });
      console.log("state set:", transactions);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  }

  handleTextChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleButtonClickDel = async () => {
    try {
      await fetch(`${this.backendUrl}/transaction`, { method: 'DELETE' });
      this.setState({ text_amt: "", text_desc: "", transactions: [] });
      this.populateData();
    } catch (err) {
      console.error("Failed to delete transactions:", err);
    }
  }

  handleButtonClick = async () => {
    const { text_amt, text_desc } = this.state;
    try {
      await fetch(`${this.backendUrl}/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: text_amt, desc: text_desc })
      });
      this.setState({ text_amt: "", text_desc: "" });
      this.populateData();
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  }

  renderTableData() {
    const { transactions } = this.state;
    if (!Array.isArray(transactions)) return null;

    return transactions.map(({ id, amount, description }) => (
      <tr key={id}>
        <td>{id}</td>
        <td>{amount}</td>
        <td>{description}</td>
      </tr>
    ));
  }

  render() {
    const { text_amt, text_desc } = this.state;

    return (
      <div>
        <h1 id='title' style={{ paddingRight: "1em" }}>
          Aurora Database Demo Page
        </h1>
        <input
          style={{ float: "right", marginBottom: "1em" }}
          type="button"
          value="DEL"
          onClick={this.handleButtonClickDel}
        />
        <table id='transactions'>
          <tbody>
            <tr>
              <td>ID</td>
              <td>AMOUNT</td>
              <td>DESC</td>
            </tr>
            <tr>
              <td><input type="button" value="ADD" onClick={this.handleButtonClick} /></td>
              <td><input type="text" name="text_amt" value={text_amt} onChange={this.handleTextChange} /></td>
              <td><input type="text" name="text_desc" value={text_desc} onChange={this.handleTextChange} /></td>
            </tr>
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DatabaseDemo;
