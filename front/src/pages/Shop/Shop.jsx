import React, { useContext, useEffect, useState } from 'react';
import { Card, Spinner, TextInput, Button } from 'flowbite-react';
import { AuthContext } from '../../contexts/AuthProvider';
import { HiSearch } from "react-icons/hi";

export default function Shop() {
  const { loading } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [email, setEmail] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/all-books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  }, [loading]);

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handleSearchChange = event => {
    setSearchKeyword(event.target.value);
  };

  const sendEmail = (filePath, bookTitle) => {
    fetch('http://localhost:5000/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        filePath,
        bookTitle,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Email sent:', data);
        alert('Email sent successfully!');
      })
      .catch(error => {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      });
  };

  const handleDownloadClick = (bookId) => {
    fetch(`http://localhost:5000/increment-download-count/${bookId}`, {
      method: 'PATCH',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Download count incremented:', data);
        // Update the local state to reflect the new download count
        setBooks(prevBooks =>
          prevBooks.map(book =>
            book._id === bookId ? { ...book, downloadCount: book.downloadCount + 1 } : book
          )
        );
      })
      .catch(error => {
        console.error('Error incrementing download count:', error);
      });
  };

  const handleSendLinkClick = (bookId) => {
    fetch(`http://localhost:5000/increment-sendlink-count/${bookId}`, {
      method: 'PATCH',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Send link count incremented:', data);
        // Update the local state to reflect the new download count
        setBooks(prevBooks =>
          prevBooks.map(book =>
            book._id === bookId ? { ...book, sentLinks: book.sentLinks + 1 } : book
          )
        );
      })
      .catch(error => {
        console.error('Error incrementing sent links count:', error);
      });
  };
  if (loading) {
    return (
      <div className="text-center mt-28">
        <Spinner aria-label="Center-aligned spinner example" />
      </div>
    );
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="my-28 px-4 lg:px-24">
      <h2 className="text-3xl font-bold text-center mb-16 z-40">All Books are Available Here</h2>
      <div className="flex justify-center mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title"
            value={searchKeyword}
            onChange={handleSearchChange}
            className="w-96 pl-10 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiSearch className="text-gray-500" />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
        {filteredBooks.map(book => (
          <Card key={book.title}>
           
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{book.title}</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">{book.description}</p>
            <div className="flex flex-col gap-4">
            <a
              href={book.filePath}
              Download={book.title}
              onClick={() => handleDownloadClick(book._id)}
            >
              <Button className="bg-blue-600 text-white rounded">Download PDF</Button>
            </a>
              <TextInput
                type="email"
                placeholder="Enter your email to send download link"
                value={email}
                onChange={handleEmailChange}
              />
            <Button
              className="bg-blue-600 text-white rounded"
              onClick={() => {
                sendEmail(book.filePath, book.title);
                handleSendLinkClick(book._id);
              }}
            >
              Send Download Link
            </Button>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
