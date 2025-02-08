import React, { useState } from "react";
import { motion } from "framer-motion";
import { contact } from "../../portfolio";
import "./Contact.css";

interface ContactProps {
  theme: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    border: string;
  };
}

const Contact: React.FC<ContactProps> = ({ colors }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can add your form submission logic
    window.location.href = `mailto:${contact.email}?subject=Contact from ${formData.name}&body=${formData.message}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.section
      id="contact"
      className="contact-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="contact-title" style={{ color: colors.text }}>
        Contact Me
      </h2>
      <p className="contact-description" style={{ color: colors.secondary }}>
        {contact.description}
      </p>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border,
            }}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border,
            }}
          />
        </div>
        <div className="form-group">
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.border,
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: colors.accent,
            color: colors.background,
          }}
        >
          Send Message
        </button>
      </form>
    </motion.section>
  );
};

export default Contact;
