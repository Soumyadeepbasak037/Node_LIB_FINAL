const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const upload = multer();

const PORT = 5000;
app.use(express.json());
const bookfile_path = path.join(__dirname, 'books.json');
const memberfile_path = path.join(__dirname, 'member.json');
const issuefile_path = path.join(__dirname,'issue.json')
// const userRoutes = require('./routes/users');
const bookManagerRoutes = require('./bookmanager.js');
const memberManagerRoutes = require('./membermanager.js');

// Use routes
// app.use('/api/users', userRoutes);
app.use('/books', bookManagerRoutes);
app.use('/members', memberManagerRoutes);

// Start server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/issue-book', upload.none(), (req, res) => {
    const target_book_id = req.body.book_id;
    const target_member_id = parseInt(req.body.member_id);

    try {
        const bookfile_data = fs.readFileSync(bookfile_path, 'utf-8');
        const memberfile_data = fs.readFileSync(memberfile_path, 'utf-8');

        const books = JSON.parse(bookfile_data);
        const members = JSON.parse(memberfile_data);

        const req_book_ind = books.findIndex((element) => {
            return element.id === target_book_id;
        });

        const req_member_id = members.findIndex((element) => {
            return element.id === target_member_id;
        });

        if (req_member_id !== -1 && req_book_ind !== -1) {
            const new_issue = {
                member: target_member_id,
                book: target_book_id,
                id: Date.now().toString()
            };

            const issue_data = fs.readFileSync(issuefile_path, 'utf-8');
            const issue_arr = JSON.parse(issue_data);
            issue_arr.push(new_issue);

            fs.writeFileSync(issuefile_path, JSON.stringify(issue_arr));
            res.send(issue_arr);
        }
    } catch (error) {
        res.send(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
