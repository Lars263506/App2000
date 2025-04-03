import GetStartedContent from '../models/GetStartedContent.js'

/**
 * @description Henter det nyeste "Kom i gang"-innholdet fra databasen
 */
export const getGetStartedContent = async (req, res) => {
  try {
    const content = await GetStartedContent.findOne().sort({ updatedAt: -1 }) // hent siste lagrede
    if (!content) {
      return res.status(404).json({ message: 'Innhold ikke funnet.' })
    }
    res.status(200).json(content)
  } catch (error) {
    res.status(500).json({ message: 'Feil ved henting av innhold.' })
  }
}

/**
 * @description Lagrer eller oppdaterer "Kom i gang"-innholdet
 */
export const saveGetStartedContent = async (req, res) => {
  try {
    const { beginnerTitle, beginnerDescription, advancedTitle, advancedDescription } = req.body

    const existing = await GetStartedContent.findOne()

    if (existing) {
      // oppdater eksisterende dokument
      existing.beginnerTitle = beginnerTitle
      existing.beginnerDescription = beginnerDescription
      existing.advancedTitle = advancedTitle
      existing.advancedDescription = advancedDescription
      await existing.save()
      return res.status(200).json(existing)
    }

    // hvis det ikke finnes, opprett nytt
    const newContent = new GetStartedContent({
      beginnerTitle,
      beginnerDescription,
      advancedTitle,
      advancedDescription
    })

    await newContent.save()
    res.status(201).json(newContent)
  } catch (error) {
    res.status(500).json({ message: 'Feil ved lagring av innhold.' })
  }
}
