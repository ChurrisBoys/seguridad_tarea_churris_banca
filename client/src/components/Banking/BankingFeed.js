import Layout from "../Common/Layout";
import React, { useState, useEffect } from 'react';
import config from "../../config";
import {authFetch} from '../Common/Utils'
import { Link } from 'react-router-dom';

const pageSize = 8;

const transactions = [
];

function SliceTransactions(currentPage, pageSize) {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return transactions.slice(startIndex, endIndex);
}


const CreateTransactionButton = () => {
    return (
        <Link to="/banking/createtransaction"> 
            <button className="btn btn-dark btn-primary">Create transaction</button>
        </Link>
    );
}

function NextPageButton({ currentPage, setPage }) {
    return (
        <button className="btn btn-dark btn-primary" onClick={() => { setPage(currentPage + 1) }}>Next</button>
    );
}

function TransactionRow({ transaction }) {
    return (
        <tr>
            <td>{transaction[0]}</td>
            <td>{transaction[1]}</td>
            <td>{transaction[2]}</td>
            <td>{transaction[3]}</td>
        </tr>
    );
}

function TransactionTable({ transactions }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Amount</th>
                    <th>Currency used</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction, index) => (
                    <TransactionRow key={index} transaction={transactions[index]} />
                ))}
            </tbody>
        </table>
    );
}

function BankingFeed({ transactions, currentPage, setPage }) {
    const [currencyInfo, setCurrencyInfo] = useState({ currency: '', balance: 0 });
	const [transactionss, setTransactions] = useState([0,0,0,0]);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
                const response = await fetch(`${config.BASE_URL}/getUserTransactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (response.status == 403) {
                    alert('You must be logged in, error: ' + response.status);
                }
                const databaseTransactions = await response.json();
                if(databaseTransactions === null || databaseTransactions.length === 0)
                    databaseTransactions = [0,0,0,0];
                setTransactions(databaseTransactions);
		} catch (error) {
			console.error('Failed to fetch transactions', error);
		}
		};
		fetchTransactions();
	}, []);

    
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await authFetch(`${config.BASE_URL}/getBalance`, {
                    method: 'POST',
                    headers: {
                        'authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });
                const data = await response.json();
                setCurrencyInfo(data);
            } catch (error) {
                console.error('Error fetching balance data:', error);
            }
        };

        fetchBalance();
    }, []);

    return (
        <div>
            <Layout>
                <div className="row">
                    <div className="col-10">
                        <div className="currency-amount-info">
                            <p>Currency: {currencyInfo.currency}</p>
                            <p>Total Amount: {currencyInfo.balance}</p>
                        </div>
                        <TransactionTable transactions={transactionss} />
                        <NextPageButton currentPage={currentPage} setPage={setPage} />
                    </div>
                    <div className="col">
                        <CreateTransactionButton />
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default function Banking() {
    const [currentPage, setPage] = React.useState(1);
    const transactions = SliceTransactions(currentPage, pageSize);

    return <BankingFeed transactions={transactions} currentPage={currentPage} setPage={setPage} />;
}

