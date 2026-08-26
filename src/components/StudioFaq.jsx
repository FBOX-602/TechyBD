import { useId, useMemo, useState } from "react";
import "./studio-faq.css";

const DEFAULT_FAQS = [
  {
    id: "project-types",
    question: "What kind of projects do you take on?",
    answer: "We build focused eCommerce websites, landing pages, and digital experiences for businesses that need a clearer path from first visit to enquiry or order.",
  },
  {
    id: "timeline",
    question: "How long does a typical engagement take?",
    answer: "Most focused launches take two to four weeks. A larger store, custom flow, or content-heavy project gets a clear milestone plan before work begins.",
  },
  {
    id: "pricing",
    question: "What's your pricing structure?",
    answer: "Every scope is priced around the work that actually matters. You will receive a simple proposal with deliverables, timeline, and payment milestones before committing.",
  },
  {
    id: "founders",
    question: "Do you work with founders directly?",
    answer: "Yes. We work closely with founders and small teams to keep decisions quick, the message clear, and the final site grounded in your business goals.",
  },
  {
    id: "development",
    question: "Can you handle development too?",
    answer: "Yes. Strategy, design, build, mobile testing, and launch support can all live in one focused engagement, so the experience stays consistent.",
  },
  {
    id: "after-launch",
    question: "What happens after the project ships?",
    answer: "You get a practical handover and a clear next-step plan. Ongoing maintenance, updates, and improvements can be arranged when you need them.",
  },
  {
    id: "remote",
    question: "Where are you based, and do you work remote?",
    answer: "Techy BD is based in Bangladesh and works remotely with teams wherever they are. We keep the process simple with clear updates and shared checkpoints.",
  },
];

const DEFAULT_COPY = {
  eyebrow: "Got questions?",
  title: "Questions, answered honestly.",
  highlight: "answered",
  description: "A few practical answers about process, timing, and what it is like to work with Techy BD. If yours is not here, a real person will answer it.",
  ctaTitle: "Still curious?",
  ctaDescription: "Book a short intro call and we will talk through the website, goals, and the clearest next step.",
  ctaLabel: "Let's talk",
  ctaHref: "/contact",
  responseNote: "Avg. response time: under 4 hours",
};

const DEFAULT_AVATARS = [
  { initials: "M", tone: "navy" },
  { initials: "S", tone: "orange" },
  { initials: "J", tone: "blue" },
  { initials: "K", tone: "sun" },
];

function withDefinedValues(values) {
  return Object.fromEntries(Object.entries(values || {}).filter(([, value]) => value !== undefined && value !== null));
}

function normalizeFaqs(faqs) {
  if (!Array.isArray(faqs)) return [];

  return faqs
    .map((faq, index) => {
      if (Array.isArray(faq)) {
        return { id: `faq-${index}`, question: faq[0], answer: faq[1] };
      }

      return {
        id: faq?.id || `faq-${index}`,
        question: faq?.question || faq?.title,
        answer: faq?.answer || faq?.copy || faq?.description,
      };
    })
    .filter((faq) => faq.question && faq.answer);
}

function AnswerText({ children }) {
  if (typeof children !== "string") return children;

  return children.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function Heading({ title, highlight }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;

  const [before, ...afterParts] = title.split(highlight);
  const after = afterParts.join(highlight);

  return <>
    {before}
    <span className="studio-faq__highlight">{highlight}</span>
    {after}
  </>;
}

/**
 * A self-contained FAQ section suitable for a landing page or a full FAQ route.
 *
 * `faqs` accepts [{ id, question, answer }] or legacy [question, answer] tuples.
 * `content` can override all display copy. Passing the existing `trust` setting
 * maps its faqEyebrow, faqTitle and faqCopy fields automatically.
 */
export function StudioFaq({
  faqs,
  content,
  trust,
  brand,
  navigate,
  className = "",
  initialOpenIndex = 0,
}) {
  const sectionId = useId().replace(/:/g, "");
  const [openIndex, setOpenIndex] = useState(initialOpenIndex);
  const faqItems = useMemo(() => {
    const normalized = normalizeFaqs(faqs);
    return normalized.length ? normalized : DEFAULT_FAQS;
  }, [faqs]);

  const trustCopy = withDefinedValues({
    eyebrow: trust?.faqEyebrow,
    title: trust?.faqTitle,
    highlight: trust?.faqAccent,
    description: trust?.faqCopy,
  });
  const copy = {
    ...DEFAULT_COPY,
    ...trustCopy,
    ...withDefinedValues(content),
  };
  const avatars = Array.isArray(content?.avatars) && content.avatars.length ? content.avatars : DEFAULT_AVATARS;
  const brandName = typeof brand === "string" ? brand : brand?.name || "Techy BD";
  const isInternalCta = copy.ctaHref?.startsWith("/");

  const handleCta = (event) => {
    content?.onCtaClick?.(event);
    if (event.defaultPrevented || !isInternalCta || typeof navigate !== "function") return;
    event.preventDefault();
    navigate(copy.ctaHref);
  };

  return (
    <section id="faq" className={`studio-faq ${className}`.trim()} aria-label={`${brandName} frequently asked questions`}>
      <div className="studio-faq__frame">
        <aside className="studio-faq__sidebar">
          <span className="studio-faq__eyebrow">{copy.eyebrow}</span>
          <h2 className="studio-faq__title">
            <Heading title={copy.title} highlight={copy.highlight} />
          </h2>
          <p className="studio-faq__lead">{copy.description}</p>

          <div className="studio-faq__cta-card">
            <span className="studio-faq__cta-square" aria-hidden="true" />
            <div className="studio-faq__avatars" aria-label={`${brandName} team`}>
              {avatars.slice(0, 4).map((avatar, index) => {
                const initials = typeof avatar === "string" ? avatar : avatar.initials || avatar.label || "T";
                const tone = typeof avatar === "string" ? DEFAULT_AVATARS[index]?.tone : avatar.tone || DEFAULT_AVATARS[index]?.tone;
                return <span key={`${initials}-${index}`} className={`studio-faq__avatar studio-faq__avatar--${tone}`}>{initials}</span>;
              })}
            </div>
            <h3>{copy.ctaTitle}</h3>
            <p>{copy.ctaDescription}</p>
            <a
              className="studio-faq__cta-button"
              href={copy.ctaHref}
              onClick={handleCta}
              target={isInternalCta ? undefined : "_blank"}
              rel={isInternalCta ? undefined : "noreferrer"}
            >
              {copy.ctaLabel}<span className="studio-faq__button-arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <p className="studio-faq__response-note"><span aria-hidden="true" />{copy.responseNote}</p>
        </aside>

        <div className="studio-faq__list" aria-label="Frequently asked questions">
          {faqItems.map((faq, index) => {
            const isOpen = openIndex === index;
            const answerId = `${sectionId}-answer-${index}`;
            const questionId = `${sectionId}-question-${index}`;

            return (
              <article className={`studio-faq__item${isOpen ? " is-open" : ""}`} key={faq.id || questionId}>
                <button
                  id={questionId}
                  className="studio-faq__question"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{faq.question}</span>
                  <span className="studio-faq__toggle-icon" aria-hidden="true">+</span>
                </button>
                <div
                  id={answerId}
                  className="studio-faq__answer"
                  role="region"
                  aria-labelledby={questionId}
                  aria-hidden={!isOpen}
                >
                  <p><AnswerText>{faq.answer}</AnswerText></p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StudioFaq;
