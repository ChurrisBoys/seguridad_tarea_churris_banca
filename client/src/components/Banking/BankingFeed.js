import React from "react";
import Layout from "../Common/Layout";

const pageSize = 2;


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


function SliceTransactions(page, pageSize) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return transactions.slice(startIndex, endIndex);

}

function CreateTransactionButton() {
    return (
        <button className="btn btn-primary">Realizar Transaccion</button>
    );
}

function NextPageButton({ page, setPage }) {
    return (
        <button className="btn btn-primary" onClick={() => { setPage((page % pageSize) + 1) }}>Siguiente</button>
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
                    <th>Monto</th>
                    <th>Tipo</th>
                    <th>Cuenta de origen</th>
                    <th>Cuenta de destino</th>
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

function BankingFeed({ transactions, page, setPage }) {
    return (
        <div>
            <Layout>
                {CreateTransactionButton()}
                <TransactionTable transactions={transactions} />
                {NextPageButton({ page, setPage })}
            </Layout>
        </div>
    );
}

export default function Banking() {
    const [page, setPage] = React.useState(1);
    const transactions = SliceTransactions(page, pageSize);


    return <BankingFeed transactions={transactions} page={page} setPage={setPage} />;
}
