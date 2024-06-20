import React, { useState } from 'react';
import { Button, Label, TextInput, Textarea } from 'flowbite-react';

const UploadBook = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title || !description || !file) {
      alert('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    fetch('http://localhost:5000/upload-book', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert('File uploaded successfully');
        setTitle('');
        setDescription('');
        setFile(null);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('File upload failed');
      });
  };

  return (
    <div className="px-4 my-12">
      <h2 className="mb-8 text-3xl font-bold">Upload A File</h2>
      <form className="flex lg:w-[1180px] flex-col flex-wrap gap-4" onSubmit={handleSubmit}>

        {/* Title */}
        <div className="mb-2 block">
          <Label htmlFor="fileTitle" value="File Title" />
          <TextInput
            id="fileTitle"
            placeholder="File Title"
            required
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full"
          />
        </div>

        {/* Description */}
        <div className="mb-2 block">
          <Label htmlFor="fileDescription" value="File Description" />
          <Textarea
            id="fileDescription"
            placeholder="File Description"
            required
            value={description}
            onChange={handleDescriptionChange}
            className="w-full"
            rows={4}
          />
        </div>

        {/* File Upload */}
        <div className="mb-2 block">
          <Label htmlFor="fileUpload" value="Upload File" />
          <input
            id="fileUpload"
            type="file"
            required
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="mt-5">
          Upload File
        </Button>
      </form>
    </div>
  );
};

export default UploadBook;
