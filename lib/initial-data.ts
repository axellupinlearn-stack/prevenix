import { DatabaseSchema } from './types'

export const initialData: DatabaseSchema = {
  settings: {
    id: 'default_settings',
    site_name: 'PREVENIX',
    denomination: "Société de Courtage d'Assurances",
    slogan: "Votre meilleure assurance, c'est votre courtier.",
    phone1: '08 84 97 25',
    phone2: '03 43 43 25',
    whatsapp: '+22508849725',
    email: 'contact@prevenix.ci',
    address: 'Cocody Angré Djibi, 100 m avant la station Shell',
    city_country: "Abidjan, Côte d'Ivoire",
    hero_title: "Votre meilleure assurance, c'est votre courtier.",
    hero_subtitle:
      "Parce que votre tranquillité d'esprit mérite le meilleur accompagnement, PREVENIX vous aide à trouver des solutions d'assurance adaptées à vos besoins et à votre quotidien.",
    about_title: 'PREVENIX, votre partenaire de confiance.',
    about_text:
      "PREVENIX est une société de courtage d'assurances en Côte d'Ivoire, dédiée à la protection des particuliers, des familles et des entreprises. Contrairement à un agent général lié à une seule marque, nous sommes 100% indépendants : nous négocions pour vous auprès des plus grandes compagnies du marché ivoirien pour vous garantir le meilleur rapport garanties/prix et un accompagnement sans faille en cas de sinistre.",
    cta_title: 'Votre protection commence par le bon conseil.',
    cta_subtitle:
      "Faites confiance à PREVENIX pour vous accompagner dans le choix de vos solutions d'assurance.",
    social_facebook: 'https://facebook.com/prevenix',
    social_linkedin: 'https://linkedin.com/company/prevenix',
    social_instagram: 'https://instagram.com/prevenix',
    updated_at: new Date().toISOString(),
  },
  solutions: [
    {
      id: 'sol-auto',
      slug: 'assurance-automobile',
      title: 'Assurance Automobile',
      short_desc:
        'Assurez différemment votre véhicule et restez ZEN sur toutes les routes de Côte d’Ivoire.',
      full_desc:
        'Que vous soyez particulier ou gestionnaire de flotte, PREVENIX sélectionne les garanties optimales : Responsabilité Civile obligatoire, Tierce Complète, Vol, Incendie, Bris de Glaces et Assistance 24/7 en cas de panne ou sinistre.',
      icon: 'Car',
      image_url: '/images/hero/auto-zen-car.jpg',
      features: [
        'Formule ZEN sur mesure',
        'Assistance dépannage 24/7',
        'Prise en charge rapide des sinistres',
        'Option véhicule de remplacement',
      ],
      order_num: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'sol-sante',
      slug: 'assurance-sante',
      title: 'Assurance Santé & Famille',
      short_desc:
        'Une couverture santé complète pour préserver ce que vous avez de plus cher : vos proches.',
      full_desc:
        'Accédez aux meilleures cliniques et pharmacies d’Abidjan et de l’intérieur du pays avec le tiers-payant : hospitalisation, consultations, maternité, soins dentaires et optiques pris en charge sereinement.',
      icon: 'HeartPulse',
      image_url: '/images/hero/happy-african-family.jpg',
      features: [
        'Réseau étendu de cliniques et pharmacies',
        'Tiers-payant sans avance de frais',
        'Couverture maternité et pédiatrie',
        'Évacuation sanitaire d’urgence',
      ],
      order_num: 2,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'sol-habitation',
      slug: 'assurance-habitation',
      title: 'Assurance Habitation & Biens',
      short_desc:
        'Protégez votre domicile, vos meubles et équipements contre tous les imprévus.',
      full_desc:
        'Votre logement est votre sanctuaire. PREVENIX vous protège contre les incendies, dégâts des eaux, vols, explosions, catastrophes climatiques et engage la Responsabilité Civile Chef de Famille.',
      icon: 'Home',
      image_url: '/images/campaigns/affiche-partenariat-confiance.png',
      features: [
        'Protection contre incendie et dégâts des eaux',
        'Garantie vol et vandalisme',
        'Responsabilité civile chef de famille',
        'Remboursement en valeur à neuf',
      ],
      order_num: 3,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'sol-vie',
      slug: 'assurance-vie-prevoyance',
      title: 'Assurance Vie & Prévoyance',
      short_desc:
        'Anticipez l’avenir, sécurisez les études de vos enfants et préparez votre retraite.',
      full_desc:
        'Construisez un patrimoine sûr avec des solutions d’épargne rémunérée et protégez l’avenir financier de votre famille en cas de coup dur grâce à un capital garanti.',
      icon: 'ShieldCheck',
      image_url: '/images/hero/man-smiling-blue.jpg',
      features: [
        'Garantie études des enfants',
        'Capital décès et invalidité',
        'Épargne retraite bonifiée',
        'Transmission patrimoniale avantageuse',
      ],
      order_num: 4,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'sol-pro',
      slug: 'assurance-professionnelle',
      title: 'Assurance Entreprise & Professionnelle',
      short_desc:
        'Protégez l’activité, les locaux, la flotte et la responsabilité de votre entreprise.',
      full_desc:
        'PME, commerçants, professions libérales et grandes entreprises : bénéficiez d’un audit complet de vos risques. Multirisque professionnelle, RC Exploitation, perte d’exploitation et assurance collective de vos salariés.',
      icon: 'Briefcase',
      image_url: '/images/hero/man-suit-executive.jpg',
      features: [
        'Multirisque professionnelle sur mesure',
        'Responsabilité civile exploitation & décennale',
        'Assurance santé collective des employés',
        'Couverture flotte automobile pro',
      ],
      order_num: 5,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'sol-autres',
      slug: 'autres-solutions-assurance',
      title: 'Autres Solutions d’Assurance',
      short_desc:
        'Assurance voyage, transport de marchandises, cautions de marchés et assurances chantiers.',
      full_desc:
        'Pour tous vos projets spécifiques en Côte d’Ivoire et à l’international, PREVENIX dispose des solutions adéquates pour couvrir les risques industriels, logistiques et financiers.',
      icon: 'Layers',
      image_url: '/images/campaigns/affiche-comparateur-avantages.png',
      features: [
        'Assurance voyage visa Schengen / Monde',
        'Transport de marchandises maritimes & terrestres',
        'Tous Risques Chantier (TRC) et BTP',
        'Cautions et garanties financières',
      ],
      order_num: 6,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ],
  articles: [
    {
      id: 'art-1',
      slug: 'pourquoi-passer-par-un-courtier-cote-divoire',
      title: 'Pourquoi passer par un courtier en assurances plutôt qu’une compagnie directe ?',
      category: 'Conseils & Expertise',
      summary:
        'Contrairement à un agent général qui ne propose que les produits de sa propre enseigne, le courtier défend exclusivement vos intérêts auprès de toutes les compagnies.',
      content: `## Le rôle clé du courtier d'assurance en Côte d'Ivoire

En Côte d'Ivoire, le marché de l'assurance est vaste et comporte plusieurs dizaines de compagnies offrant des conditions, des tarifs et des exclusions parfois complexes à décrypter pour un particulier ou un chef d'entreprise.

### 1. Une indépendance totale à votre service
Le courtier en assurances est mandataire du client, et non des compagnies d'assurance. Son rôle fondamental consiste à comparer les offres du marché pour sélectionner celle qui correspond exactement à vos exigences réelles, tout en négociant des tarifs préférentiels.

### 2. Le meilleur rapport Prix / Garanties
Passer par PREVENIX ne vous coûte pas plus cher : au contraire ! Grâce au volume d'affaires que nous gérons auprès des assureurs partenaires, nous obtenons des réductions tarifaires et des extensions de garanties introuvables pour un souscripteur isolé.

### 3. Une assistance déterminante en cas de sinistre
C'est le moment de vérité de tout contrat d'assurance. En cas d'accident, de vol ou de sinistre, PREVENIX prend en charge l'intégralité de la gestion administrative de votre dossier, relance les experts et s'assure que vous soyez indemnisé dans les délais les plus brefs.

> **Slogan officiel PREVENIX :** *« Votre meilleure assurance, c'est votre courtier. »*`,
      cover_image: '/images/campaigns/affiche-sourire-courtier.png',
      author: 'L’équipe PREVENIX',
      read_time: '4 min de lecture',
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 'art-2',
      slug: 'comment-bien-choisir-son-assurance-auto-abidjan',
      title: 'Comment bien choisir son assurance automobile à Abidjan et rouler ZEN ?',
      category: 'Guide Auto',
      summary:
        'Au-delà du simple tiers obligatoire, découvrez les garanties indispensables pour protéger votre véhicule dans la circulation abidjanaise.',
      content: `## Rouler en toute tranquillité dans le Grand Abidjan

La circulation à Abidjan présente des défis quotidiens : embouteillages, voies express, intempéries saisonnières. Souscrire uniquement la Responsabilité Civile obligatoire vous met en conformité avec la loi, mais ne couvre aucun dommage subi par votre propre véhicule !

### Les 4 niveaux de protection recommandés par PREVENIX :
1. **Responsabilité Civile + Défense & Recours :** Le socle légal incontournable.
2. **Formule Tiers Amélioré :** Ajout des garanties Vol, Incendie et Bris de Glaces (très recommandé face aux projections de gravillons et aux intempéries).
3. **Dommages Collision :** Indemnisation de vos réparations dès lors qu'un tiers identifié est impliqué.
4. **Tous Risques (Tierce Complète) :** La tranquillité absolue, couvrant tous les dommages même en cas d'accident sans tiers ou responsable.

Contactez nos conseillers à Cocody Angré Djibi pour un devis comparatif immédiat.`,
      cover_image: '/images/hero/auto-zen-car.jpg',
      author: 'Département Flotte & Auto',
      read_time: '3 min de lecture',
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 'art-3',
      slug: 'sante-famille-couverture-medicale-efficace',
      title: 'Santé & Famille : Comment garantir une prise en charge médicale optimale en Côte d’Ivoire ?',
      category: 'Santé & Prévoyance',
      summary:
        'L’accès rapide aux soins de qualité sans avance de frais est un impératif pour toute famille. Voici comment structurer votre couverture santé.',
      content: `## Préserver la santé de ceux que vous aimez

Les dépenses médicales imprévues peuvent déstabiliser le budget d'un ménage. Une assurance santé adaptée permet de faire face aux soins du quotidien comme aux hospitalisations lourdes.

### Les critères essentiels d'un bon contrat santé :
- **Le réseau de tiers-payant :** La possibilité de vous soigner dans les cliniques et polycliniques de référence d'Abidjan sans devoir avancer l'argent.
- **Le plafond d'hospitalisation :** Un niveau de prise en charge suffisant pour couvrir les actes chirurgicaux et les séjours en chambre particulière.
- **La couverture optique et dentaire :** Deux postes de dépenses souvent coûteux pour les enfants et les parents.
- **L'assistance évacuation sanitaire :** Une sécurité vitale pour les cas complexes nécessitant un transfert spécialisé.`,
      cover_image: '/images/hero/happy-african-family.jpg',
      author: 'Pôle Particuliers & Prévoyance',
      read_time: '4 min de lecture',
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 'art-4',
      slug: 'entrepreneurs-pourquoi-multirisque-professionnelle-indispensable',
      title: 'Entreprises ivoiriennes : Pourquoi la multirisque professionnelle est votre meilleur bouclier ?',
      category: 'Entreprise & PME',
      summary:
        'Incendie, vol, interruption d’activité : découvrez comment sécuriser les actifs de votre entreprise et assurer sa pérennité.',
      content: `## Sécuriser vos investissements et la continuité de votre activité

Un sinistre majeur peut mettre en péril des années de travail acharné. Pour les PME, commerces, entrepôts et cabinets de conseil, l'assurance multirisque professionnelle constitue le rempart indispensable.

PREVENIX réalise un audit préalable de vos installations afin d'identifier les risques réels et vous proposer des garanties sur mesure sans surcoût inutile.`,
      cover_image: '/images/hero/man-suit-executive.jpg',
      author: 'Pôle Risques Entreprises',
      read_time: '5 min de lecture',
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ],
  media: [
    {
      id: 'med-1',
      title: "Campagne Officielle « Votre Meilleur Assurance, c'est votre Courtier »",
      type: 'publicite',
      url: '/images/campaigns/affiche-sourire-courtier.png',
      thumbnail: '/images/campaigns/affiche-sourire-courtier.png',
      description:
        'Affiche institutionnelle PREVENIX soulignant la relation de confiance et l’expertise humaine du courtier.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med-2',
      title: "Campagne Partenariat & Conseil Cadres",
      type: 'publicite',
      url: '/images/campaigns/affiche-professionnel-costume.png',
      thumbnail: '/images/campaigns/affiche-professionnel-costume.png',
      description:
        'Visuel de marque destiné aux professionnels et décideurs en Côte d’Ivoire.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med-3',
      title: "Campagne Partenariat d'Affaires & Poignée de Main",
      type: 'publicite',
      url: '/images/campaigns/affiche-partenariat-confiance.png',
      thumbnail: '/images/campaigns/affiche-partenariat-confiance.png',
      description:
        'L’engagement contractuel et la confiance mutuelle au cœur de notre démarche de courtage.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med-4',
      title: "Campagne Auto ZEN : « Assurez différemment votre voiture et restez ZEN »",
      type: 'publicite',
      url: '/images/campaigns/affiche-auto-zen.png',
      thumbnail: '/images/campaigns/affiche-auto-zen.png',
      description:
        'Affiche officielle de l’offre automobile PREVENIX mettant en avant la sérénité du conducteur.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med-5',
      title: "Campagne Protection Famille Heureuse",
      type: 'photo',
      url: '/images/campaigns/affiche-famille-protection.png',
      thumbnail: '/images/campaigns/affiche-famille-protection.png',
      description:
        'Photographie emblématique de la protection santé et prévoyance familiale PREVENIX.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med-6',
      title: "Campagne Comparateur d'Assurance : Les 4 Engagements",
      type: 'publicite',
      url: '/images/campaigns/affiche-comparateur-avantages.png',
      thumbnail: '/images/campaigns/affiche-comparateur-avantages.png',
      description:
        '1. La meilleure assurance, 2. Le meilleur Prix/Garanties, 3. La meilleure prestation sinistre, 4. Le meilleur suivi.',
      created_at: new Date().toISOString(),
    },
    {
      id: 'med-7',
      title: "Présentation vidéo : Les avantages du courtage d'assurance",
      type: 'video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtube_id: 'dQw4w9WgXcQ',
      thumbnail: '/images/hero/mobile-advisor.jpg',
      description:
        'Capsule vidéo explicative : comment PREVENIX négocie et optimise vos contrats d’assurance.',
      created_at: new Date().toISOString(),
    },
  ],
  quotes: [],
  messages: [],
}
