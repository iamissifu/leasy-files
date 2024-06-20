import React, { useState } from 'react';
import { Button, Label, Select, TextInput, Textarea } from 'flowbite-react';
import { useLoaderData, useParams } from 'react-router-dom';


const EditBooks = () => {
  const { id } = useParams();
  const { fileTitle, fileDescription, bookPDFURL } = useLoaderData();

  const handleUpdate = (event) => {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData();
    formData.append('title', form.fileTitle.value);
    formData.append('description', form.fileDescription.value);

    if (form.fileUpload.files[0]) {
      formData.append('bookPDF', form.fileUpload.files[0]);
    } else {
      formData.append('bookPDFURL', bookPDFURL);
    }

    fetch(`http://localhost:5000/book/${id}`, {
      method: 'PATCH',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert('File updated successfully');
        console.log(data);
      });
  };

  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold'>Edit Book</h2>
      <form className="flex lg:w-[1180px] flex-col flex-wrap gap-4" onSubmit={handleUpdate}>

        {/* File Title */}
        <div className='lg:w-1/2'>
          <div className="mb-2 block">
            <Label htmlFor="fileTitle" value="File Title" />
          </div>
          <TextInput
            id="fileTitle"
            placeholder="File Title"
            required
            type="text"
            name='fileTitle'
            className='w-full'
            defaultValue={fileTitle}
          />
        </div>

        {/* File Description */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="fileDescription" value="File Description" />
          </div>
          <Textarea
            id="fileDescription"
            placeholder="File Description"
            required
            type="text"
            name='fileDescription'
            className='w-full'
            rows={4}
            defaultValue={fileDescription}
          />
        </div>

        {/* File Upload */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="fileUpload" value="Upload File" />
          </div>
          <input
            id="fileUpload"
            type="file"
            name='fileUpload'  // Changed from 'bookPDF' to 'fileUpload'
            className='w-full'
            accept="application/pdf"
          />
        </div>

        {/* Submit button */}
        <Button type="submit" className='mt-5'>
          Update File
        </Button>

      </form>
    </div>
  );
};

export default EditBooks;
