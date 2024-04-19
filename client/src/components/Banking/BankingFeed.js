import React from "react";


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
    }
];


function CreateTransactionButton() {
    return (
        <button className="btn btn-primary">Realizar Transaccion</button>
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

function BankingFeed({ transactions }) {
    return (
        <div>
            {CreateTransactionButton()}
            <TransactionTable transactions={transactions} />
        </div>
    );
}

export default function Banking() {
    return <BankingFeed transactions={transactions} />;
}
