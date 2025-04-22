import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

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
