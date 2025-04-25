import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

/**
 Copilot has been used to generate the code for the functions and comments,
but all content has been reviewed and edited to ensure accuracy and alignment
with the project's requirements.
*/

/**
 * ContactPage Component
 * Provides a contact form for users to submit inquiries or feedback.
 * Includes translated text using i18next for localization support.
 * 
 * @author Andreas Nilsen
 */

/**
 * Form data structure for the contact form
 * @typedef {Object} FormData
 * @property {string} name - The name of the user submitting the form.
 * @property {string} email - The email address of the user.
 * @property {string} subject - The subject of the inquiry.
 * @property {string} message - The message content of the inquiry.
 * @author Andreas Nilsen
 */

const ContactPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Handles changes to the form fields and updates the state.
   * 
   * @function handleChange
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event from the input or textarea.
   * @returns {void}
   * @author Andreas Nilsen
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  /**
   * Handles the form submission process, including validation and feedback.
   * Displays success or error messages based on the outcome.
   * 
   * @function handleSubmit
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>}
   * @author Andreas Nilsen
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      setTimeout(() => {
        toast.success(t('contactpage_toast_success_form_success'))
        router.push('/')
      }, 1000)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t('contactpage_toast_error_form_failed'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-8">
      <div className="bg-[#E7EFFB] p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-semibold text-center text-[#1B365D] mb-8">
          {t('contactpage_header_text1')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-[#1B365D] text-lg mb-2">{t('contactpage_name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              className="border border-[#ddd] p-3 rounded-md"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-[#1B365D] text-lg mb-2">{t('contactpage_epost')}</label>
            <input
              type="email"
              id="email"
              name="email"
              className="border border-[#ddd] p-3 rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="subject" className="text-[#1B365D] text-lg mb-2">{t('contactpage_emne')}</label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="border border-[#ddd] p-3 rounded-md"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="message" className="text-[#1B365D] text-lg mb-2">{t('contactpage_mesage')}</label>
            <textarea
              id="message"
              name="message"
              className="border border-[#ddd] p-3 rounded-md"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#1B365D] text-white py-2 px-6 rounded-md hover:bg-[#5A8FCC] transition-colors duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('contactpage_sending') : t('contactpage_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactPage
