import React, { useState } from 'react'
import { useRouter } from 'next/router'

const ContactPage = () => {
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
        alert('Takk for din henvendelse! Vi svarer deg snart.')
        router.push('/')
      }, 1000)
    } catch (error) {
      alert('Noe gikk galt, prøv igjen senere.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-8">
      <div className="bg-[#E7EFFB] p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-semibold text-center text-[#1B365D] mb-8">
          Kontakt oss
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-[#1B365D] text-lg mb-2">Navn</label>
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
            <label htmlFor="email" className="text-[#1B365D] text-lg mb-2">E-post</label>
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
            <label htmlFor="subject" className="text-[#1B365D] text-lg mb-2">Emne</label>
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
            <label htmlFor="message" className="text-[#1B365D] text-lg mb-2">Meldingen din</label>
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
              {isSubmitting ? 'Sender...' : 'Send inn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactPage
