import React, { type FormEvent } from 'react';
import Navbar from "~/Components/Navbar";
import { useState } from 'react';
import FileUploader from "~/Components/FileUploader";

const Upload = () => {
    // isProcessing -> false (initially)
    const [isProcessing, setIsProcessing] = useState (false);
    // textStatus -> empty string
    const [textStatus, setTextStatus] = useState ('');
    const [file, setFile] = useState<File | null> (null);
    const handlefileSelect = (file : File | null) => {
        setFile (file);
    }
    const handleSubmit = (e : FormEvent <HTMLFormElement>) => {
        e.preventDefault();
        const form : HTMLFormElement | null = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName : FormDataEntryValue | null = formData.get('company-name');
        const jobTitle : FormDataEntryValue | null = formData.get('job-title');
        const jobDescription : FormDataEntryValue | null = formData.get('job-description');

        console.log({
            companyName, jobTitle, jobDescription, file
        });
    }

    return (
        <>
        <main className = "bg-[url('/images/bg-main.svg')] bg-cover">
           <Navbar></Navbar>
            <section className = "main-section">
                <div className="page-heading py-16">
                    <h1>Smart Feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{textStatus}</h2>
                            <img src="/images/resume-scan.gif" className="w-full"/>
                        </>
                    ) : (
                        <h2>Drop your resume for ATS score and improvement tips</h2>
                    )}

                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className = "flex flex-col gap-4 mt-4">
                            <div className = "form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company name" id="company-name"/>
                            </div>

                            <div className = "form-div">
                                <label htmlFor="job-title">Job title</label>
                                <input type="text" name="job-title" placeholder="Job title" id="job-title"/>
                            </div>

                            <div className = "form-div">
                                <label htmlFor="job-desc">Job description</label>
                                <textarea rows={5} name="job-description" placeholder="Job description" id="job-desc" />
                            </div>

                            <div className = "form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handlefileSelect}></FileUploader>
                            </div>

                            <button className = "primary-button" type = "submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
        </>
    )
};

export default Upload;