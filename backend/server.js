import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());

const users = [];
const accounts = [];
const sessions = [];

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

app.post("/users", (req, res) => {
    const { username, password } = req.body;
    const userId = users.length + 1;
    users.push({ id: userId, username, password });

    const account = { id: accounts.length + 1, userId, amount: 0 }
    accounts.push(account);

    res.status(200).json({ message: "Konto skapat!", userId });
});

app.post("/sessions", (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
        return res.status(400).json({ error: "Fel användarnamn eller lösenord" });
    }

    const token = generateOTP();
    sessions.push({ userId: user.id, token });

    res.status(200).json({ token });
});

app.post("/me/accounts", (req, res) => {
    const { token } = req.body;
    const session = sessions.find((s) => s.token === token);

    if (!session) {
        return res.status(401).json({ error: "Ogiltig token" });
    }

    const account = accounts.find(a => a.userId === session.userId);

    if (!account) {
        return res.status(404).json({ error: "Konto inte hittat" });
    }

    res.status(200).json({ saldo: account.amount });
});

app.post("/me/accounts/transactions", (req, res) => {
    const { token, amount } = req.body;
    const session = sessions.find((s) => s.token === token);

    if (!session) {
        return res.status(401).json({ error: "Sessionen har gått ut. Logga in igen" });
    }

    const account = accounts.find(a => a.userId === session.userId);

    if (!account) {
        return res.status(404).json({ error: "Konto inte hittat" });
    }

    account.amount += amount;

    res.status(200).json({ newSaldo: account.amount });
});

app.post("/logout", (req, res) => {
    const { token } = req.body;

    const sessionIndex = sessions.findIndex(s => s.token === token);

    if (sessionIndex === -1) {
        return res.status(401).json({ error: "Ogiltig session" });
    }

    sessions.splice(sessionIndex, 1);

    res.status(200).json({ message: "Utloggning lyckades" });
});

app.listen(3002, '0.0.0.0', () => {
    console.log(`Bankens backend körs på http://0.0.0.0:3002`);
});



