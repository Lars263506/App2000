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
          clubdetails_go_back: 'Go back',
          clublist_search: 'Search for clubs',
          clubmap_loading: 'Loading map...',
          clubmap_title: 'Club map',
          clubmap_prompt_action: 'Select a red pin to see more information.',
          clubmap_visit_club: 'Visit the club page',
          discgolfinfo_title: 'What is Disc Golf?',
          discgolfinfo_intro: 'Disc golf is a sport that combines elements of golf and frisbee.',
          discgolfinfo_text: 'Disc golf courses vary in length and difficulty. Some courses have obstacles such as trees, bushes and water that make the game more challenging. Try to follow course etiquette for a good experience.',
          discgolfinfo_playnow: 'Play Now',
          getstarted_title: 'Getting Started with Disc Golf',
          getstarted_description: 'Disc golf is a fun and accessible sport for everyone. Here are some tips to help you get started.',
          getstarted_choose: 'Choose between beginnner or advanced tips.',
          getstarted_beginnerbutton: 'Beginner Tips',
          getstarted_advancedbutton: 'Advanced Tips',
          getstarted_beginner_title: 'Beginner Tips',
          getstarted_beginner_description: 'Disc golf is a fun and inclusive sport that is easy to learn but challenging to master. Here are some great tips to get started:',
          getstarted_beginner_tips: [
            "<strong>1. Choose the right disc:</strong> Start with a <strong>putter</strong> or a <strong>midrange disc</strong>. They are easier to control than fast drivers.",
            "<strong>2. Learn the basic throws:</strong> Backhand, forehand (sidearm), and putting are the most important techniques.",
            "<strong>3. Understand the rules:</strong> Start from the tee area and throw toward the basket. After each throw, continue playing from where the disc landed.",
            "<strong>4. Focus on technique rather than power:</strong> Calm and controlled throws yield better results than trying to throw too hard.",
            "<strong>5. Play with experienced players:</strong> Learning from more experienced players helps you progress faster.",
            "<strong>6. Have realistic expectations:</strong> Hit a tree? No problem! It's part of the learning process.",
            "<strong>7. Use simple equipment:</strong> Start with affordable discs and upgrade as you go.",
            "<strong>8. Practice regularly:</strong> The more you play, the better you get!"
          ],
          getstarted_advanced_title: 'Advanced Tips',
          getstarted_advanced_description: 'Once you have mastered the basics, here are some advanced tips to take your game to the next level:',
          getstarted_advanced_tips: [
            "<strong>1. Use different discs:</strong> Speed 9-12 drivers for control, Speed 13+ for distance.",
            "<strong>2. Master advanced throwing techniques:</strong> Learn hyzer, anhyzer, and roller throws for more flexibility.",
            "<strong>3. Understand the impact of wind:</strong> Practice in various weather conditions to improve control over your throws.",
            "<strong>4. Improve mental strength:</strong> Practice strategic thinking and staying calm under pressure.",
            "<strong>5. Physical training and maintenance:</strong> Mobility, strength, and endurance affect your throwing technique.",
            "<strong>6. Play on advanced courses:</strong> Challenge yourself with narrow passages and technically demanding holes.",
            "<strong>7. Practice specific situations:</strong> Training throws from difficult terrain leads to better results in tournaments."
          ],
          course_search: 'Search for courses',
          error_notanarray: 'Error: The data is not an array.',
          error_getcourses: 'Error: Could not fetch courses.',
          error_fetch_members: 'Error: Could not fetch members.',
          error_fetching_admin_status: 'Error: Could not fetch admin status.',
          error_generic: 'Error: Something went wrong fetching data.',
          coursemap_alldifficulties: 'All difficulties',
          coursemap_easy: 'Easy',
          coursemap_medium: 'Medium',
          coursemap_hard: 'Hard',
          member_benefit_title: "Join a club",
          member_benefit_intro: "As a member, you gain access to a variety of benefits:",
          member_benefit_list: {
            discounts: "<strong>Discounts on tournaments and events:</strong> Membership often provides discounts on entry fees for local and national tournaments or special events.",
            exclusive_training: "<strong>Exclusive training:</strong> Access to organized training sessions to improve your skills.",
            networking: "<strong>Networking opportunities:</strong> Meet other players and build friendships while learning from experienced players.",
            priority_booking: "<strong>Priority access to booking:</strong> Members get priority access to course reservations, especially during busy periods.",
            competitions: "<strong>Participation in competitions:</strong> Opportunity to participate in the club's own tournaments and competitions."
          },
          memberlist_title: 'Member List',
          memberlist_loading: 'Loading members...',
          memberlist_nomembers: 'No members found.',
          navbar_logotext_norways: "Norway's",
          navbar_logotext_association: 'Disc Golf Association',
          navigation_getstarted_title: 'Get Started',
          navigation_getstarted_description: 'Learn the basics of disc golf and how to play.',
          navigation_courses_title: 'Courses',
          navigation_courses_description: 'Find courses near you and explore new ones.',
          navigation_clubs_title: 'Clubs',
          navigation_clubs_description: 'Join a local club and connect with other players.',
          footer_contactus: 'Contact Us',
          footer_privacy: 'Privacy Policy',
          withadminaccess_loading: 'Loading...',
        },
      },
      no: {
        translation: {
          clubdetails_go_back: 'Gå tilbake',
          clublist_search: 'Søk etter klubber',
          clubmap_loading: 'Laster kart...',
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
          error_fetch_members: 'Feil: Kunne ikke hente medlemmer.',
          error_fetching_admin_status: 'Feil: Kunne ikke hente admin-status.',
          error_generic: 'Feil: Noe gikk galt med å hente data.',
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
          memberlist_title: 'Medlemsliste',
          memberlist_loading: 'Laster medlemmer...',
          memberlist_nomembers: 'Ingen medlemmer funnet.',
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
