import Layout from "../Common/Layout";
import React, { useState, useEffect } from 'react';
import config from "../../config";

const pageSize = 8;

const transactions = [
    {
        amount: 100,
        type: "deposit",
        sourceAccount: "my_account",
        destinationAccount: "my_account"
    },
    {
        amount: 200,
        type: "withdraw",
        sourceAccount: "my_account",
        destinationAccount: "my_account"
    },
    {
        amount: 300,
        type: "deposit",
        sourceAccount: "my_account",
        destinationAccount: "my_account"
    },
    {
        amount: 400,
        type: "withdraw",
        sourceAccount: "my_account",
        destinationAccount: "my_account"
    }
];

function SliceTransactions(currentPage, pageSize) {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return transactions.slice(startIndex, endIndex);
}

const CreateTransactionButton = () => {
    return (
        <button className="btn btn-dark btn-primary">Create transaction</button>
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
            <td>{transaction.amount}</td>
            <td>{transaction.type}</td>
            <td>{transaction.sourceAccount}</td>
            <td>{transaction.destinationAccount}</td>
        </tr>
    );
}

function TransactionTable({ transactions }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Transferring account</th>
                    <th>Target account</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction, index) => (
                    <TransactionRow key={index} transaction={transaction} />
                ))}
            </tbody>
        </table>
    );
}

function BankingFeed({ transactions, currentPage, setPage }) {
    const [currencyInfo, setCurrencyInfo] = useState({ currency: '', balance: 0 });

    
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await fetch(`${config.BASE_URL}/getBalance`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
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
                        <TransactionTable transactions={transactions} />
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

