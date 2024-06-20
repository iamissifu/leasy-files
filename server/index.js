

import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import session from 'express-session';
import path from 'path';
import authRoutes from '../front/backend/routes/auth.js'; // Ensure this path is correct


// Define the Employee model
const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // Add other fields as required
});

const Employee = mongoose.model('Employee', EmployeeSchema);


const __dirname = path.resolve();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));


// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: 'sibdooissifu@gmail.com',
        pass: 'zvyn jnzh npvy bkir',
    },
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const uri = "mongodb+srv://lizzy-bizz_24:8xhSaoJP67tnszmZ@cluster0.vyyrp43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        await client.connect();
        const bookCollections = client.db("BookInventory").collection("Books");

        // Upload book route
        app.post("/upload-book", upload.single('file'), async (req, res) => {
            const { title, description } = req.body;
            const file = req.file;

            if (!file) {
                return res.status(400).send('No file uploaded.');
            }

            const bookObj = {
                title,
                description,
                filePath: `http://localhost:${port}/uploads/${file.filename}`,
                fileName: file.originalname,
                fileMimeType: file.mimetype,
                uploadDate: new Date()
            };

            const result = await bookCollections.insertOne(bookObj);
            res.send(result);
        });

        // Get all books route
        app.get("/all-books", async (req, res) => {
            let query = {};
            if (req.query?.category) {
                query = { category: req.query.category };
            }
            const result = await bookCollections.find(query).toArray();
            res.send(result);
        });

        //number of downloads
        app.patch("/increment-download-count/:id", async (req, res) => {
            const id = req.params.id;
            try {
              const result = await bookCollections.updateOne(
                { _id: new ObjectId(id) },
                { $inc: { downloadCount: 1 } }
              );
              if (result.modifiedCount === 1) {
                res.json({ message: 'Download count incremented' });
              } else {
                res.status(404).json({ message: 'Book not found' });
              }
            } catch (error) {
              console.error('Error incrementing download count:', error);
              res.status(500).json({ message: 'Internal server error' });
            }
          });


          //number of links sent
        app.patch("/increment-sendlink-count/:id", async (req, res) => {
            const id = req.params.id;
            try {
              const result = await bookCollections.updateOne(
                { _id: new ObjectId(id) },
                { $inc: { sentLinks: 1 } }
              );
              if (result.modifiedCount === 1) {
                res.json({ message: 'Download count incremented' });
              } else {
                res.status(404).json({ message: 'Book not found' });
              }
            } catch (error) {
              console.error('Error incrementing download count:', error);
              res.status(500).json({ message: 'Internal server error' });
            }
          });
          

        // Update a book method
        app.patch("/book/:id", upload.single('bookPDF'), async (req, res) => {
            const id = req.params.id;
            const { fileTitle, fileDescription } = req.body;
            const file = req.file;

            const filter = { _id: new ObjectId(id) };
            const updateFields = {
                fileTitle,
                fileDescription,
                ...(file && {
                    bookPDFURL: file.path,
                    title: file.originalname,
                    bookPDFMimeType: file.mimetype,
                })
            };
            const updatedDoc = {
                $set: updateFields,
            };

            const result = await bookCollections.updateOne(filter, updatedDoc);
            res.send(result);
        });

        // Delete a book from db
        app.delete("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollections.deleteOne(filter);
            res.send(result);
        });

        // Get a single book data
        app.get("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollections.findOne(filter);
            res.send(result);
        });

        // registering customer
        app.post("/register", (req, res) => {
            Employee.create(req.body)
                .then(employee => res.json(employee))
                .catch(err => res.json(err));
        });

        // Send email route
        app.post('/send-email', (req, res) => {
            const { email, filePath, bookTitle } = req.body;

            const mailOptions = {
                from: 'sibdooissifu@gmail.com',
                to: email,
                subject: `Download Link for ${bookTitle}`,
                text: `You can download the book "${bookTitle}" using the following link: ${filePath}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).send(error.toString());
                }
                res.json({ message: 'Email sent', info });
            });
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
