import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const storedLanguage =
  typeof window !== 'undefined' && localStorage.getItem('language')
    ? localStorage.getItem('language') || 'no'
    : 'no';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    lng: storedLanguage,
    fallbackLng: 'no',
    resources: {
      en: {
        translation: {
          // ... (ingen endringer i engelsk her, men legg til oversettelser hvis ønskelig)
          getstarted_rulesbutton: "Rules",
          getstarted_rules_title: "Disc Golf Rules",
          getstarted_rules_description: "Here are the most important rules to know before you play.",
          getstarted_rules_list: [
            "<strong>1. Throw from the tee:</strong> The first throw is made from a designated tee area.",
            "<strong>2. Play from where the disc lands:</strong> Each subsequent throw is taken from where the previous one landed.",
            "<strong>3. Finish in the basket:</strong> A hole is completed when the disc rests in the basket or chains.",
            "<strong>4. Fewest throws wins:</strong> Just like traditional golf.",
            "<strong>5. Respect others:</strong> Wait your turn and be considerate of players and nature."
          ]
        },
      },
      no: {
        translation: {
          // 👇 Disse 5 linjene er lagt til eller oppdatert
          getstarted_rulesbutton: "Regler",
          getstarted_rules_title: "Reglene i diskgolf",
          getstarted_rules_description: "Her finner du de viktigste reglene du må kjenne til før du spiller.",
          getstarted_rules_list: [
            "<strong>1. Kast fra tee:</strong> Første kast tas fra et fast område.",
            "<strong>2. Spill der discen lander:</strong> Fortsett kast fra der discen ligger.",
            "<strong>3. Fullfør i kurven:</strong> Når discen er i kurven, er hullet fullført.",
            "<strong>4. Antall kast:</strong> Lavest mulig antall kast vinner.",
            "<strong>5. Respekt:</strong> Vis hensyn til andre spillere og naturen."
          ],
          
          // 👇 Her følger resten av eksisterende oversettelser uendret
          clublist_search: 'Søk etter klubber',
          clubmap_title: 'Klubbkart',
          clubmap_prompt_action: 'Velg en rød pin for å se mer informasjon.',
          clubmap_visit_club: 'Besøk klubbens side',
          discgolfinfo_title: 'Hva er diskgolf?',
          discgolfinfo_intro: 'Diskgolf er en sport som kombinerer elementer fra golf og frisbee.',
          discgolfinfo_text: 'Diskgolfbaner varierer i lengde og vanskelighetsgrad. Noen baner har hindringer som trær, busker og vann som gjør spillet mer utfordrende. Prøv å følge etikette på banen for en god opplevelse.',
          discgolfinfo_playnow: 'Spill nå',
          getstarted_title: 'Kom i gang med diskgolf',
          getstarted_description: 'Diskgolf er en morsom og tilgjengelig sport for alle. Her er noen tips for å komme i gang.',
          getstarted_choose: 'Velg mellom nybegynner- eller avanserte tips.',
          getstarted_beginnerbutton: 'Nybegynnertips',
          getstarted_advancedbutton: 'Avanserte tips',
          getstarted_beginner_title: 'Nybegynnertips',
          getstarted_beginner_description: 'Diskgolf er en morsom og inkluderende sport som er enkel å lære, men utfordrende å mestre. Her er noen gode tips for å komme i gang:',
          getstarted_beginner_tips: [
            '<strong>1. Velg riktig disc:</strong> Start med en <strong>putter</strong> eller en <strong>midrange-disc</strong>. De er enklere å kontrollere enn raske drivere.',
            '<strong>2. Lær de grunnleggende kastene:</strong> Backhand, forehand (sidearm) og putting er de viktigste teknikkene.',
            '<strong>3. Forstå reglene:</strong> Start fra tee-området og kast mot kurven. Etter hvert kast spiller du videre fra der discen lander.',
            '<strong>4. Fokuser på teknikk fremfor kraft:</strong> Rolige og kontrollerte kast gir bedre resultater enn å prøve å kaste for hardt.',
            '<strong>5. Spill med erfarne spillere:</strong> Å lære av mer erfarne spillere gir raskere progresjon.',
            '<strong>6. Ha realistiske forventninger:</strong> Treffer du et tre? Ingen fare! Det er en del av læringsprosessen.',
            '<strong>7. Bruk enkelt utstyr:</strong> Start med rimelige discer og oppgrader etter hvert.',
            '<strong>8. Øv jevnlig:</strong> Jo mer du spiller, jo bedre blir du!'
          ],
          getstarted_advanced_title: 'Avanserte tips',
          getstarted_advanced_description: 'Når du har mestret det grunnleggende, her er noen avanserte tips for å ta spillet ditt til neste nivå:',
          getstarted_advanced_tips: [
            '<strong>1. Bruk forskjellige disker:</strong> Speed 9-12 drivere for kontroll, Speed 13+ for lengde.',
            '<strong>2. Mestre avanserte kasteteknikker:</strong> Lær hyzer, anhyzer og roller-kast for mer fleksibilitet.',
            '<strong>3. Forstå vindens innvirkning:</strong> Trening i ulike værforhold gir bedre kontroll på kast.',
            '<strong>4. Forbedre mental styrke:</strong> Øv på strategisk tenkning og å holde hodet kaldt under press.',
            '<strong>5. Fysisk trening og vedlikehold:</strong> Mobilitet, styrke og utholdenhet påvirker kasteteknikken din.',
            '<strong>6. Spill på avanserte baner:</strong> Utfordre deg selv med trange passasjer og teknisk krevende hull.',
            '<strong>7. Øv på spesifikke situasjoner:</strong> Trening på kast fra vanskelig terreng gir bedre resultater i turneringer.'
          ],
          course_search: 'Søk etter baner',
          error_notanarray: 'Feil: Dataen er ikke en liste.',
          error_getcourses: 'Feil: Kunne ikke hente baner.',
          error_fetching_admin_status: 'Feil ved henting av admin-status.',
          coursemap_alldifficulties: 'Alle vanskelighetsgrader',
          coursemap_easy: 'Lett',
          coursemap_medium: 'Middels',
          coursemap_hard: 'Vanskelig',
          member_benefit_title: "Medlemsfordeler",
          member_benefit_intro: "Som medlem får du tilgang til en rekke fordeler:",
          member_benefit_list: {
            discounts: "<strong>Rabatter på turneringer og arrangementer:</strong> Medlemskap gir ofte rabatter på deltakeravgifter for lokale og nasjonale turneringer eller spesialarrangementer.",
            exclusive_training: "<strong>Eksklusive trening:</strong> Tilgang til organiserte treningsøkter for å forbedre ferdighetene dine.",
            networking: "<strong>Nettverksmuligheter:</strong> Møte andre spillere og bygge vennskap, samtidig som du lærer av erfarne spillere.",
            priority_booking: "<strong>Prioritert tilgang til booking:</strong> Medlemmer får prioritert tilgang til banereservasjoner, spesielt i travle perioder.",
            competitions: "<strong>Deltakelse i konkurranser:</strong> Mulighet til å delta i klubbens egne turneringer og konkurranser."
          },
          navbar_logotext_norways: 'Norges',
          navbar_logotext_association: 'Diskgolf-forbund',
          navigation_getstarted_title: 'Kom i gang',
          navigation_getstarted_description: 'Lær det grunnleggende om diskgolf og hvordan du spiller.',
          navigation_courses_title: 'Baner',
          navigation_courses_description: 'Finn baner nær deg og utforsk nye.',
          navigation_clubs_title: 'Klubber',
          navigation_clubs_description: 'Bli med i en lokal klubb og knytt kontakt med andre spillere.',
          footer_contactus: 'Kontakt oss',
          footer_privacy: 'Personvern',
          withadminaccess_loading: 'Laster...'
        },
      },
    },
  });

export default i18next;
