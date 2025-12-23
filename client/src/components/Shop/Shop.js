import React, { useState } from 'react';
import { useEffect } from 'react';
import "./shop.css";
import Web3 from 'web3';
import HandlerABI from 'C:/Users/Ashish Anand/Desktop/Capstone/client/src/ContractABI/handlerABI.json';
import InsuraCoinABI from 'C:/Users/Ashish Anand/Desktop/Capstone/client/src/ContractABI/insuraCoinABI.json';
import ShopABI from 'C:/Users/Ashish Anand/Desktop/Capstone/client/src/ContractABI/shopABI.json';

// import ashHandler2ABI from 'D:/BlockChain WorkSpace/InsuraChain/client/src/ContractABI/ashHandler2.json';
// import ashContract5ABI from 'D:/BlockChain WorkSpace/InsuraChain/client/src/ContractABI/ashContract5.json';

const HandlerAddress = "0x1ccf3b6533eD67044ce74beAb8C313024fBbF7f3";
const InsuraCoinAddress = "0x01Ebec677adde8759B10b17fE1d87542cE4fD4E4";
const ShopAddress = "0x6e3D2875dF55f4f5eA1DB38f0974858359d1Ff3D";


// const ashContract5Address = "0x5EBcc82E298ABdCEDC844CCC8286678124AA0FE4";
// const ashHander2Address = "0xa215C03c6328E18C5E3A23F8032757a0A52d1a67"

function Shop() {
    
    var account = null;
    let con = new Web3(Web3.givenProvider || "http://localhost:7545"); 
    var HandlerContract = new con.eth.Contract(HandlerABI, HandlerAddress);
    var InsuraCoinContract = new con.eth.Contract(InsuraCoinABI, InsuraCoinAddress);
    var ShopContract = new con.eth.Contract(ShopABI, ShopAddress);
    // console.log(HandlerContract);

    // var ashContract5 = new con.eth.Contract(ashContract5ABI, ashContract5Address);
    // var ashHandler2 = new con.eth.Contract(ashHandler2ABI, ashHander2Address);

    const [buyTokens, setBuyTokens] = useState("");
    const [sellTokens, setSellTokens] = useState("");
    const [balance, setBalance] = useState(0);
    const [shopbalance, setShopBalance] = useState(0);

    const purchase = async () => {
        if (window.ethereum) {
            await window.ethereum.send('eth_requestAccounts' )
            window.w3 = new Web3(window.ethereum)
            var accounts = await window.w3.eth.getAccounts()
            account = accounts[0];
            console.log(account); // yeh woh account hai jo metamask mein hai
        }

        // InsuraCoinContract.methods.transfer(ShopAddress, 10000).send({
        //     from: account
        // });
        const requestBuy = await ShopContract.methods.buyTokens().send({
        from: accounts[0],
        value: Web3.utils.toWei(buyTokens.toString(), "wei"),
        });
        // console.log(requestBuy);

        // const hardcodecheck = await ashContract5.methods.addData("0xDe75012f00fFa0B169aDD7ECBbB8D2336ca1AA37","CHUTIYA ASHISH").send({
        //     from: accounts[0]
        // });
        // console.log(hardcodecheck);

        // const hardcode = await ashContract5.methods.getData("0xDe75012f00fFa0B169aDD7ECBbB8D2336ca1AA37",1).call();
        // console.log(hardcode);
        updateBalance();
    }

    const sell = async () => {
        if (window.ethereum) {
            await window.ethereum.send('eth_requestAccounts' )
            window.w3 = new Web3(window.ethereum)
            var accounts = await window.w3.eth.getAccounts()
            account = accounts[0];
            console.log(account); // yeh woh account hai jo metamask mein hai
        }

        InsuraCoinContract.methods.approve(ShopAddress, 10000).send({
            from: accounts[0]
         })

        const requestSell = await ShopContract.methods.sellTokens(sellTokens).send({
        from: accounts[0],
        });
        console.log(requestSell);
        updateBalance();
    }

    const updateBalance = async () => {
        
        window.w3 = new Web3(window.ethereum)
        var accounts = await window.w3.eth.getAccounts()
        account = accounts[0];
        setBalance(await InsuraCoinContract.methods.balanceOf(account).call());
        setShopBalance(await ShopContract.methods.shopBalance().call())
        // console.log(ShopContract.methods.shopBalance().call())
        // console.log(balance);
    }


    useEffect(() => {
        if (ShopContract!=null){
            updateBalance();
        }
    }, [shopbalance ,balance]);

    
    return (
      <div>
          <div className="exchange__container">
              <div>
                <p> Shop balance - {shopbalance}</p>
                <p className='legendary-text'></p>
              </div>
              <div>
                  <input onChange={(event) => {setBuyTokens(event.target.value)}} type="number" placeholder="Amount of Wei" className="exchange__textBox" />
                  <button className="exchange__button" onClick={purchase}>
                      Purchase
                  </button>
              </div>

              <div>
                  <input onChange={(event) => {setSellTokens(event.target.value)}} type="number" placeholder="1 wei = 100 tokens" className="exchange__textBox" />
                  <button className="exchange__button" onClick={sell}>
                      Sell
                  </button>
              </div>
              <div>
                <p> User Balance - {balance}</p>
              </div>
          </div>
      </div>
  );
}
export default Shop;