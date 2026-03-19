import icon from '../assets/favicon.png';
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
          <img src={icon} alt="logo" style={{ width: '22px', height: '22px' }}/>
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