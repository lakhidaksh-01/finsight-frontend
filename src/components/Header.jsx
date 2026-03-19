export default function Header() {

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="header">

      <div className="logo-wrap">
        <div className="logo-icon">
          💹
        </div>

        <div className="logo-text">
          Fin<span>Sight</span>
        </div>
      </div>

      <div className="header-right">
        <div className="hdr-date">{today}</div>
        <div className="trust-badge">
          <span class="dot"></span>
          Secure & Private
        </div>
      </div>

    </div>
  );
}