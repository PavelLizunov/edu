import { T } from "@/components/i18n/t";

export function Footer() {
  return (
    <footer className="bigfoot">
      <div className="huge">
        edu<br />
        <span className="pop">.ninitux</span><br />
        <span className="yel">
          <T ru="шпаргалка" en="cheatsheet" />
        </span>
      </div>
      <div className="cols">
        <div>
          <h4>
            <T ru="часть сети" en="part of" />
          </h4>
          <p>
            <a href="https://ninitux.com">ninitux.com</a>
          </p>
          <p>
            <a href="https://docs.ninitux.com">docs.ninitux.com</a>
          </p>
          <p>
            <a href="https://md.ninitux.com">md.ninitux.com</a>
          </p>
        </div>
        <div>
          <h4>
            <T ru="код" en="source" />
          </h4>
          <p>
            <a
              href="https://github.com/PavelLizunov/edu"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/PavelLizunov/edu
            </a>
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>MIT · open</p>
        </div>
        <div>
          <h4>
            <T ru="формат" en="format" />
          </h4>
          <p>
            <T ru="аналогия → концепции" en="analogy → concepts" />
          </p>
          <p>
            <T ru="→ команды → квиз" en="→ commands → quiz" />
          </p>
        </div>
        <div>
          <h4>
            <T ru="автор" en="maintainer" />
          </h4>
          <p>P. Lizunov</p>
          <p>
            <a
              href="https://t.me/ninitux_auth_bot"
              target="_blank"
              rel="noopener noreferrer"
            >
              @ninitux
            </a>
          </p>
        </div>
      </div>
      <div className="legal">
        <span>© 2026 edu.ninitux.com</span>
        <span>·</span>
        <span>
          <T
            ru="часть ninitux.com · без cookies · без трекеров"
            en="part of ninitux.com · no cookies · no trackers"
          />
        </span>
      </div>
    </footer>
  );
}
