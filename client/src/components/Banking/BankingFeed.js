import React from "react";
import Layout from "../Common/Layout";

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
    const createTransaction = async () => {
        const newTransaction = {
            // Define your transaction data here
            amount: 500,
            type: "deposit",
            sourceAccount: "my_account",
            destinationAccount: "my_account"
        };

        try {
            const response = await fetch('http://172.24.131.198:3001/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTransaction)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <button className="btn btn-dark btn-primary" onClick={createTransaction}>Create transaction</button>
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
                {transactions.map(transaction => (
                    <TransactionRow transaction={transaction} />
                ))}
            </tbody>
        </table>
    );
}

function BankingFeed({ transactions, currentPage, setPage }) {
    return (
        <div>
            <Layout>
                <div class="row">
                    <div class="col-10">
                        <TransactionTable transactions={transactions} />
                        {NextPageButton({ currentPage, setPage })}

                    </div>
                    <div class="col">
                        {CreateTransactionButton()}
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
