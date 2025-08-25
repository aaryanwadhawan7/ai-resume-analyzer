import React, { type FormEvent, useState } from 'react';
import Navbar from '~/Components/Navbar';
import FileUploader from '~/Components/FileUploader';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdfToImage';
import { generateUUID } from '../../src/utils/uuidGen';
import { AIResponseFormat, prepareInstructions } from '../../constants/index';

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [textStatus, setTextStatus] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);
      setTextStatus('Uploading the file...');

      const uploadFile = await window.puter.fs.upload([file]);
      if (!uploadFile) {
        setTextStatus('Error: Failed to upload file!');
        return;
      }

      setTextStatus('Converting PDF to image...');
      const imageFile = await convertPdfToImage(file);

      if (!imageFile || !imageFile.file) {
        console.error('PDF conversion result:', imageFile);
        setTextStatus('Error: Converted image file is null!');
        return;
      }

      setTextStatus('Uploading the converted image...');
      const uploadImage = await window.puter.fs.upload([imageFile.file]);
      if (!uploadImage) {
        setTextStatus('Error: Failed to upload the image!');
        return;
      }

      setTextStatus('Preparing the data...');
      const uuid = generateUUID();
      const data = {
        id: uuid,
        filePath: uploadFile.path,
        imagePath: uploadImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: '',
      };

      await window.puter.kv.set(`resume${uuid}`, JSON.stringify(data));

      setTextStatus('Analyzing with AI...');
      const instructions = prepareInstructions({
        jobTitle,
        jobDescription,
        AIResponseFormat,
      });

      let feedback: any;
      try {
        const feedbackRaw = await window.puter.ai.chat(
          instructions,
          uploadImage.path,
        );

        // handle both string and object response safely
        if (typeof feedbackRaw === 'string') {
          feedback = JSON.parse(feedbackRaw);
        } else {
          feedback = feedbackRaw;
        }
      } catch (err) {
        console.error('AI parsing failed:', err);
        setTextStatus('Error: Failed to parse AI response');
        return;
      }

      const updatedData = { ...data, feedback };
      await window.puter.kv.set(`resume${uuid}`, JSON.stringify(updatedData));

      setTextStatus('Analysis complete ✅');
      // navigate(`/home?resumeId=${uuid}`);
    } catch (error) {
      console.error('Unexpected error in handleAnalyze:', error);
      setTextStatus('Error: Something went wrong during analysis.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form || !file) return;

    const formData = new FormData(form);
    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart Feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{textStatus}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for ATS score and improvement tips</h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-4"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company name"
                  id="company-name"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job title"
                  id="job-title"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-desc">Job description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job description"
                  id="job-desc"
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
