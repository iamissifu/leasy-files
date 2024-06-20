import { Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Pagination } from 'flowbite-react';
import { Link } from 'react-router-dom';

const ManageBooks = () => {
    const [allBooks, setAllBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetch(`http://localhost:5000/all-books`)
            .then((res) => res.json())
            .then((data) => {
                setAllBooks(data);
            });
    }, []);

    // Delete a book
    const handleDelete = (id) => {
        fetch(`http://localhost:5000/book/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then(() => {
                setAllBooks(allBooks.filter(book => book._id !== id));
            });
    };

    // Pagination
    const onPageChange = (page) => setCurrentPage(page);

    return (
        <div className='px-4 my-12'>
            <h2 className='mb-8 text-3xl font-bold'>Manage Your Files Inventory!</h2>

            {/* Table */}
            <Table className='lg:w-[1180px]'>
                <Table.Head>
                    <Table.HeadCell>
                        No.
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Book Title
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Description
                    </Table.HeadCell>
                    {/* <Table.HeadCell>
                        File
                    </Table.HeadCell> */}
                    <Table.HeadCell>
                        Manage
                    </Table.HeadCell>
                    <Table.HeadCell>
                    Downloads
                    </Table.HeadCell>   <Table.HeadCell>
                    Sent Links
                    </Table.HeadCell>


                </Table.Head>

                {allBooks.map((book, index) => (
                    <Table.Body className="divide-y" key={book._id}>
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {index + 1}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {book.title}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {book.description}
                            </Table.Cell>
                            {/* <Table.Cell>
                                <a href={`/${book.filePath}`} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline dark:text-cyan-500">
                                    {book.fileName}
                                </a>
                            </Table.Cell> */}

                            <Table.Cell>
                                <Link
                                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 mr-5"
                                    to={`/admin/dashboard/edit-books/${book._id}`}
                                >
                                    Edit
                                </Link>
                                <button
                                    className='bg-red-600 px-4 py-1 font-semibold text-white rounded-sm hover:bg-red-700'
                                    onClick={() => handleDelete(book._id)}
                                >
                                    Delete
                                </button>
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {book.downloadCount || 0}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {book.sentLinks || 0}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ))}
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-center text-center mt-8">
                <Pagination
                    currentPage={currentPage}
                    layout="pagination"
                    nextLabel="Go forward"
                    onPageChange={onPageChange}
                    previousLabel="Go back"
                    showIcons
                    totalPages={10} // You should dynamically set the total pages based on your data
                />
            </div>
        </div>
    );
};

export default ManageBooks;
