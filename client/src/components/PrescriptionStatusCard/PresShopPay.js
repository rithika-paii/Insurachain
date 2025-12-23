import React, { Component, useEffect, useState } from "react";
import { Col, Container, Row} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Shop from "../Shop/Shop";
import Web3 from "web3";
import Tile from "../DynamicTile/Tile";
import './styles.css';
import PayTimer from "../PayTimer/payTimer";
import { useLocation } from "react-router-dom";
import ashPaymentABI from "D:/BlockChain WorkSpace/InsuraChain/client/src/ContractABI/ashPayment.json";

const ashPaymentAddress = "0x4BfDB6f0eB2094f3282D72e55B749701B12197f9"



function PrescriptionStatusCard() {

    const [planId, setPlanId] = useState(0);
    const [amount, setAmount] = useState(0);
    const [toggle, setToggle] = useState(false);

    const [timer,setTimer] = useState(0);

    const [myInterval,setMyInterval] = useState(null);

    
    const navigate = useNavigate()
    const location = useLocation()
    // var planNo = "0";

    let con = new Web3(Web3.givenProvider || "http://localhost:7545");
    var ashPaymentContract = new con.eth.Contract(ashPaymentABI, ashPaymentAddress);


    useEffect(() => {
        check();
    },[])

    useEffect(() => {
        console.log("Plan id is",planId)
        // startTimer()
    },[planId])

    const getTimerDuration = () =>{
        // Fetch the timer duration from the contract
        setTimer(timer=>10)
    }

    const startTimer = () =>{
        getTimerDuration();
        setToggle(true)
        console.log("My interval is ",myInterval)
        if(myInterval == null){
            var myInterval = setInterval(() => {
                setTimer(timer => timer - 1)
            }, 1000)
            setMyInterval(myInterval)
        }   
    }

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       console.log('This will run every second!');
    //     }, 1000);
    //     return () => clearInterval(interval);
    //   }, [startTimer]);

    useEffect(() => {
        console.log("New Timer value",timer)
        if (timer  === 0){
            console.log("Timer is 0")
            clearInterval(myInterval)
            setMyInterval(null)
            setToggle(false)
        }
    }, [timer])

    useEffect(() => {
        console.log("Toggle value is" ,toggle)
    }, [toggle])

    const navigateHandler = () => {
        navigate("/SubsPlan");
    }

    const payFunc = async () => {
        
        var account = null;
        window.w3 = new Web3(window.ethereum)
        var accounts = await window.w3.eth.getAccounts()
        account = accounts[0];
        console.log(planId);
        var lol = await ashPaymentContract.methods.pay(account,planId).send({from: account});
        console.log(lol)
        alert("Payment Successful");
        startTimer()
        window.location.reload(); 
        
    }

    const check = async () => {

        var account = null;
        window.w3 = new Web3(window.ethereum)
        var accounts = await window.w3.eth.getAccounts()
        account = accounts[0];
        var lol2 = await ashPaymentContract.methods.subscribedTO(account).call();
        if (lol2 != 0) {
            setToggle(false);
            startTimer()
        }else{
            setToggle(true);
        }

        setPlanId(lol2);
        

        var account = null;
        window.w3 = new Web3(window.ethereum)
        var accounts = await window.w3.eth.getAccounts()
        account = accounts[0];
        console.log("THis is the plan id",planId);
        var lol = await ashPaymentContract.methods.subscriptionAmt(lol2).call();
        console.log("The amount does is ")
        console.log(lol);
        setAmount(lol);
    }

    
    


    return (
        <div>
            <Row>
                <Col>
                    <Container className="darkbg">
                        <Row>
                            <Col xs={1}></Col>
                            <Col>
                                <Row>
                                    <Container className="darkbg"></Container>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        <Container className="lightbg">
                                            <Row>
                                                <Col xs={1}>

                                                </Col>
                                                <Col>
                                                    <Row className="spacer"></Row>
                                                    <Row>
                                                        <Col xs={3}></Col>
                                                        <Col><h2>Prescription</h2></Col>
                                                        <Col xs={2}></Col>
                                                    </Row>
                                                    <Row className="spacer"></Row>
                                                    <Row>
                                                        <Container className="darkbg2 mb-3"></Container>
                                                    </Row>
                                                    <Row>
                                                        <Tile />
                                                    </Row>
                                                </Col>

                                                <Col xs={1}></Col>
                                            </Row>
                                        </Container>
                                    </Col>
                                    <Col></Col>
                                    <Col xs={5}>
                                        <Container className="lightbg">
                                            <Row>
                                                <Col xs={1}>

                                                </Col>
                                                <Col>
                                                    <Row className="spacer"></Row>
                                                    <Row>
                                                        <Col xs={4}></Col>
                                                        <Col><h2>Shop</h2></Col>
                                                        <Col xs={2}></Col>
                                                    </Row>
                                                    <Row className="spacer"></Row>
                                                    <Row>
                                                        <Container className="darkbg2 mb-3"></Container>
                                                    </Row>
                                                </Col>
                                                <Col xs={1}></Col>
                                                <Shop />
                                                <Col xs={1}></Col>
                                            </Row>
                                        </Container>
                                    </Col>
                                </Row>
                                <Row>
                                    <Container className="darkbg">
                                        <Row className="spacer"></Row>
                                    </Container>
                                </Row>

                                    <Col xs={1}></Col>
                                    <Container className="lightbg">
                                        
                                        <p className="App"> Want to see list of subscriptions plan? </p>
                                        <center>
                                        <button className="App exchange__button__HOME" onClick={navigateHandler}>
                                        Click here
                                        </button>
                                        </center>
                                        
                                    </Container>
                                    <Col xs={1}></Col>
                                <Row className="spacer"></Row>
                                <Row className="spacer"></Row>
                                <Col xs={1}></Col>
                                    <Container className="lightbg">
                                    <center>
                                        <Row>
                                        <Container>
                                        <button disabled = {toggle} onClick = {payFunc} className="App exchange__button__HOME">
                                            PAY
                                        </button>
                                        </Container>
                                        </Row>
                                        <Row>
                                            <p>Timer:</p>
                                            <p>{timer}</p>
                                        </Row>
                                        <Row>
                                            <p>you are subscribed to plan {planId}</p>
                                        </Row>
                                        <Row>
                                            <p className="App">Amount to pay: {amount} </p>
                                        </Row>
                                    </center>
                                        
                                    </Container>
                                <Col xs={1}></Col>

                            </Col>
                            <Col xs={1}></Col>
                        </Row>
                        <Row className="spacer"></Row>
                    </Container>
                </Col>
            </Row>
        </div>
    )
}

export default PrescriptionStatusCard;