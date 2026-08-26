import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Globe2,
  MonitorSmartphone,
  ShoppingBag,
  TrendingUp,
  Zap,
} from "lucide-react";

function normalizeDomain(value) {
  const clean = String(value || "").trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return clean || "yourbrand.com";
}

function FeatureIcon({ name, size = 16 }) {
  const props = { size, strokeWidth: 2 };
  if (name === "shopping" || name === "shopping-bag") return <ShoppingBag {...props} />;
  if (name === "trending") return <TrendingUp {...props} />;
  if (name === "mobile") return <MonitorSmartphone {...props} />;
  if (name === "zap") return <Zap {...props} />;
  return <Check {...props} />;
}

function HeroLead({ hero }) {
  return (
    <div className="hero-launch__lead">
      <span className="hero-launch__eyebrow"><i aria-hidden="true" />{hero.eyebrow}</span>
      <h1>
        <span className="hero-launch__overline" lang="bn">{hero.overline}</span>
        {hero.title}
      </h1>
      <p lang="bn">{hero.copy}</p>
    </div>
  );
}

function ProjectBriefForm({ domain, onDomainChange, primaryLabel }) {
  return (
    <form className="hero-launch__project-form" action="/contact" method="get">
      <label className="hero-launch__domain-field">
        <Globe2 size={19} aria-hidden="true" />
        <span className="sr-only">Your website or brand domain</span>
        <input
          type="text"
          name="website"
          inputMode="url"
          value={domain}
          onChange={(event) => onDomainChange(event.target.value)}
          placeholder="yourbrand.com"
          aria-label="Your website or brand domain"
        />
      </label>
      <button type="submit" className="hero-launch__submit">
        {primaryLabel}<ArrowRight size={17} aria-hidden="true" />
      </button>
    </form>
  );
}

function HeroProof({ proof, features }) {
  const visibleFeatures = features?.slice(0, 3) || [];
  return (
    <div className="hero-launch__proof">
      <div className="hero-launch__proof-marks" aria-hidden="true">
        <span>T</span><span>B</span><span>D</span>
      </div>
      <p>{proof}</p>
      <div className="hero-launch__feature-list" aria-label="Website delivery focus">
        {visibleFeatures.map((feature) => (
          <span key={feature.label}><FeatureIcon name={feature.icon} size={14} />{feature.label}</span>
        ))}
      </div>
    </div>
  );
}

function BrowserChrome({ domain }) {
  return (
    <div className="hero-launch__browser-chrome" aria-hidden="true">
      <div className="hero-launch__window-controls"><i /><i /><i /></div>
      <div className="hero-launch__browser-url"><Globe2 size={13} />https://{domain}/<strong>launch</strong></div>
      <span className="hero-launch__live-dot">Live build</span>
    </div>
  );
}

function CapabilityCard({ icon, title, copy, tone = "paper" }) {
  return (
    <article className={`hero-launch__capability hero-launch__capability--${tone}`}>
      <span className="hero-launch__capability-icon">{icon}</span>
      <div><strong>{title}</strong><p>{copy}</p></div>
    </article>
  );
}

function LandingPageCanvas({ domain, preview, asset, features }) {
  const featureLabels = (features || []).map((feature) => feature.label);
  return (
    <div className="hero-launch__canvas">
      <div className="hero-launch__canvas-topbar">
        <span className="hero-launch__canvas-brand"><b>{domain.slice(0, 1).toUpperCase()}</b>{domain}</span>
        <span>About</span><span>Products</span><i />
      </div>
      <div className="hero-launch__canvas-body">
        <div className="hero-launch__canvas-copy">
          <span className="hero-launch__canvas-kicker">LANDING PAGE · READY TO LAUNCH</span>
          <h2>{preview.storeTitle} <em>{preview.storeAccent}</em></h2>
          <p>Clear offer, trusted payment and a mobile-first path from first visit to order.</p>
          <div><span>{preview.storeButton}</span><small>{preview.storeNote}</small></div>
        </div>
        <div className="hero-launch__canvas-product">
          <div className="hero-launch__product-tag">COD · bKash ready</div>
          <img src={asset} alt="Landing page design preview" />
        </div>
      </div>
      <div className="hero-launch__canvas-footer">
        <span><Check size={14} />Mobile first</span>
        <span><Check size={14} />Fast loading</span>
        <span><Check size={14} />{featureLabels[2] || "Order-focused"}</span>
      </div>
    </div>
  );
}

function LandingPageDemo({ domain, preview, assets, features }) {
  const productImage = assets.heroProductThree || assets.heroProductOne || assets.heroCheckout;
  return (
    <div className="hero-launch__demo" aria-label="Interactive landing page preview">
      <div className="hero-launch__demo-label"><span>↙</span> Live landing page preview</div>
      <div className="hero-launch__browser">
        <BrowserChrome domain={domain} />
        <div className="hero-launch__dashboard">
          <div className="hero-launch__dashboard-head">
            <span><Code2 size={17} />Website build board</span>
            <div aria-hidden="true"><i>‹</i><span>This week <ChevronDown size={13} /></span></div>
          </div>
          <div className="hero-launch__dashboard-grid">
            <LandingPageCanvas domain={domain} preview={preview} asset={productImage} features={features} />
            <aside className="hero-launch__capabilities">
              <CapabilityCard icon={<MonitorSmartphone size={18} />} title="Mobile-first" copy="Designed for the phones your customers use." tone="sky" />
              <CapabilityCard icon={<Zap size={18} />} title="Fast loading" copy="A focused page that gets to the point quickly." tone="orange" />
              <CapabilityCard icon={<ShoppingBag size={18} />} title="Order-focused" copy="bKash, Nagad and COD fit into the flow." tone="ink" />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroLaunch({ hero, assets }) {
  const [website, setWebsite] = useState("");
  const domain = useMemo(() => normalizeDomain(website), [website]);
  const preview = {
    storeTitle: "A landing page that",
    storeAccent: "feels premium",
    storeButton: "Explore offer",
    storeNote: "Fast loading · COD ready",
    ...hero.preview,
  };

  return (
    <section className="hero-section hero-launch-section">
      <div className="grid-backdrop" />
      <div className="container hero-launch">
        <HeroLead hero={hero} />
        <ProjectBriefForm
          domain={website}
          onDomainChange={setWebsite}
          primaryLabel={hero.primaryCtaLabel}
        />
        <HeroProof proof={hero.proof} features={hero.features} />
        <LandingPageDemo domain={domain} preview={preview} assets={assets} features={hero.features} />
      </div>
    </section>
  );
}
