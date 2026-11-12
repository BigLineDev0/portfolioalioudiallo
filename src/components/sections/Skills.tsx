import { useRef, type PointerEvent } from 'react';
import { FileSearch, Kanban, MessageSquare } from 'lucide-react';
import { skillGroups, type Skill } from '../../data/skills';
import { useReveal } from '../../hooks/useReveal';
import { gsap, MQ, useGSAP } from '../../lib/gsap';
import { SectionHeader } from '../ui/SectionHeader';

const GLYPHS = { rag: FileSearch, llm: MessageSquare, scrum: Kanban };

function SkillIcon({ icon }: { icon: Skill['icon'] }) {
  if (icon.type === 'glyph') {
    const Glyph = GLYPHS[icon.name];
    return <Glyph size={20} strokeWidth={1.75} className="shrink-0 text-muted" aria-hidden="true" />;
  }
  return (
    <img
      className={`tech-logo ${icon.dark ? 'tech-logo-dark' : ''}`}
      src={icon.src}
      width={20}
      height={20}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}

/** Éclairage des cartes : la position du curseur alimente le dégradé de .spotlight */
function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return;
  const card = (event.target as Element).closest<HTMLElement>('.spotlight');
  if (!card) return;
  const box = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${event.clientX - box.left}px`);
  card.style.setProperty('--my', `${event.clientY - box.top}px`);
}

export function Skills() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // Chaque carte arrive, puis ses technologies apparaissent une à une
  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add(
        MQ.motion,
        () => {
          gsap.utils.toArray<HTMLElement>('[data-skill-card]', section).forEach((card) => {
            const timeline = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 85%', once: true } });
            timeline
              .from(card, { autoAlpha: 0, y: 40, duration: 0.8, ease: 'power3.out' })
              .from(
                card.querySelectorAll('[data-skill]'),
                { autoAlpha: 0, y: 12, scale: 0.94, duration: 0.45, stagger: 0.04, ease: 'power2.out' },
                0.3,
              );
          });
        },
        section,
      );
    },
    { scope: root },
  );

  return (
    <section id="competences" ref={root} className="section bg-surface" aria-labelledby="titre-competences">
      <div className="page">
        <SectionHeader id="titre-competences" title="Compétences">
          Les technologies et outils que j'utilise dans mes projets.
        </SectionHeader>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3" onPointerMove={trackPointer}>
          {skillGroups.map((group) => (
            <article
              key={group.id}
              data-skill-card
              className="spotlight overflow-hidden rounded-3xl border border-line bg-canvas/50 p-6 sm:p-7"
            >
              <h3 className="text-h3">{group.title}</h3>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={`Technologies : ${group.title}`}>
                {group.items.map((skill) => (
                  <li key={skill.name} data-skill className="tech">
                    <SkillIcon icon={skill.icon} />
                    {skill.name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
