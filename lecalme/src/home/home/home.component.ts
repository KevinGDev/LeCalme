import {Component} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {KeyValuePipe, NgFor} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {MatIcon} from '@angular/material/icon';
import {Title} from '@angular/platform-browser';
import emailjs from '@emailjs/browser';
import {FormsModule} from '@angular/forms';

/**
 * Interface décrivant la structure d'une activité.
 */
interface Activity {
  title: string;
  description: string;
  icon: string;
  alt: string;
  type: string;
  link: string;
  address: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule, NgFor, KeyValuePipe, MatIcon, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  /** Sections ouvertes ou fermées sur la page */
  openedSections: Record<string, boolean> = {
    booking: false,
    modalities: false,
    activities: false,
    contact: false,
    location: false
  };
  currentYear: number = new Date().getFullYear();


  /** Langue courante de l'application */
  private currentLang: string;

  /** Liste des activités chargées */
  activities: Activity[] = [];

  /** Images du carrousel */
  carouselImages: string[] = [
    'assets/images/lecalme15.jpg',
    'assets/images/lecalme16.jpg',
    'assets/images/lecalme17.jpg',
    'assets/images/lecalme18.jpg',
    'assets/images/lecalme19.jpg',
    'assets/images/lecalme20.jpg',
    'assets/images/lecalme21.jpg',
    'assets/images/lecalme22.jpg',
    'assets/images/lecalme1.jpg',
    'assets/images/lecalme2.jpg',
    'assets/images/lecalme3.jpg',
    'assets/images/lecalme4.jpg',
    'assets/images/lecalme5.jpg',
    'assets/images/lecalme6.jpg',
    'assets/images/lecalme7.jpg',
    'assets/images/lecalme8.jpg',
    'assets/images/lecalme9.jpg',
    'assets/images/lecalme10.jpg',
    'assets/images/lecalme11.jpg',
    'assets/images/lecalme12.jpg',
    'assets/images/lecalme13.jpg',
    'assets/images/lecalme14.jpg',
  ];

  /** Index de l'image actuellement affichée */
  currentImageIndex = 0;

  /** Contrôle l'effet de transition lors du changement d'image */
  isFading = false;

  /**
   * Constructeur du composant Home.
   * Initialise la langue et charge les activités.
   */
  constructor(
    private readonly translate: TranslateService,
    private readonly http: HttpClient,
    private titleService: Title
  ) {
    this.translate.addLangs(['fr', 'en']);
    this.translate.setDefaultLang('fr');

    const browserLang = translate.getBrowserLang();
    this.currentLang = browserLang?.match(/fr|en/) ? browserLang : 'fr';
    this.translate.use(this.currentLang);
    this.setPageTitle();

    this.loadActivities();
  }

  private setPageTitle(): void {
    let title: string;

    switch (this.currentLang) {
      case 'fr':
        title = 'Le Calme - Chambre d’hôtes à Plessé en Loire-Atlantique';
        break;
      case 'ger':
        title = 'Le Calme - Gästehaus in Plessé, Loire-Atlantique';
        break;
      case 'en':
        title = 'Le Calme - Guesthouse in Plessé, Loire-Atlantique';
        break;
      default:
        title = 'Le Calme - Chambre d’hôtes à Plessé en Loire-Atlantique';
    }

    this.titleService.setTitle(title);
  }

  /**
   * Retourne l'image actuelle du carrousel.
   */
  get currentImage(): string {
    return this.carouselImages[this.currentImageIndex];
  }

  /**
   * Change l’image du carrousel selon la direction.
   * @param direction 'next' pour l’image suivante, 'prev' pour la précédente
   */
  changeImage(direction: 'next' | 'prev'): void {
    this.isFading = true;
    setTimeout(() => {
      const delta = direction === 'next' ? 1 : -1;
      this.currentImageIndex = (this.currentImageIndex + delta + this.carouselImages.length) % this.carouselImages.length;
      this.isFading = false;
    }, 250);
  }

  /** Affiche l'image suivante dans le carrousel */
  nextImage(): void {
    this.changeImage('next');
  }

  /** Affiche l'image précédente dans le carrousel */
  prevImage(): void {
    this.changeImage('prev');
  }

  /**
   * Bascule l’état (ouvert/fermé) d’une section.
   * @param sectionId ID de la section à basculer
   */
  toggleSection(sectionId: string): void {
    this.openedSections[sectionId] = !this.openedSections[sectionId];
  }

  /**
   * Change la langue de l'application et recharge les activités.
   * @param lang Code de langue ('fr' ou 'en')
   */
  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    this.setPageTitle();
    this.loadActivities();
  }

  /**
   * Charge les activités depuis le fichier JSON en fonction de la langue courante.
   */
  loadActivities(): void {
    this.http.get<Record<string, Activity[]>>('assets/data/activities.json').subscribe(data => {
      this.activities = data[this.currentLang] || [];
    });
  }

  /**
   * Permet d'utiliser "Entrée" ou "Espace" pour basculer une section avec le clavier.
   * @param event Événement de clavier
   * @param section ID de la section concernée
   */
  handleKeydown(event: KeyboardEvent, section: string): void {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      this.toggleSection(section);
    }
  }

  public sendEmail(e: Event) {
    e.preventDefault();

    emailjs
      .sendForm('service_0jtqgzm', 'template_y2xugoitemplate_y2xugoi', e.target as HTMLFormElement, {
        publicKey: '-T1RAve_zHnkqs7xIi-',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...');
        },
      );
  }

}
