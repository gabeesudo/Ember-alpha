import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Folder, Trophy, User, Star } from "@/components/ember-icons";
import { EmberBar, EmberStatus, WindowTitle, RELEASE } from "@/components/ember-chrome";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: RELEASE },
      {
        name: "description",
        content:
          "Seu pequeno sistema para grandes conquistas. Missões, experiência e evolução, um toque de cada vez.",
      },
    ],
  }),
  component: LandingPage,
});
function LandingPage() {
  return (
    <div className="desktop pocket-desktop">
      <EmberBar />
      <main className="pocket-workspace" id="main-content">
        <div className="pocket-topline">
          <span>KAIZEN PERSONAL SYSTEM</span>
          <span>
            <i aria-hidden="true" /> PRONTO PARA COMEÇAR
          </span>
        </div>
        <section className="pocket-intro">
          <div>
            <p className="pocket-kicker">um novo dia, um novo começo.</p>
            <h1>
              Pequenos passos.
              <br />
              <span>Grandes conquistas.</span>
            </h1>
          </div>
          <div className="pocket-stamp" aria-hidden="true">
            K<span>+</span>
            <small>EST. 1997*</small>
          </div>
        </section>
        <div className="pocket-layout">
          <section className="os-window pocket-welcome">
            <WindowTitle code="01">bem-vindo.exe</WindowTitle>
            <div className="pocket-welcome-body">
              <div className="pocket-brand">
                <div className="pocket-fire">
                  <Flame className="hero-flame" />
                </div>
                <div>
                  <strong>Kaizen</strong>
                  <span>PERSONAL GROWTH SYSTEM</span>
                </div>
              </div>
              <div className="pocket-rule" />
              <p className="pocket-message">
                Sua próxima versão
                <br />
                começa <em>agora.</em>
              </p>
              <p className="pocket-description">
                Transforme tarefas em missões. Ganhe experiência. Evolua no seu ritmo.
              </p>
              <Link to="/auth" className="pocket-start">
                <span className="pocket-start-icon">
                  <Flame />
                </span>
                <span>
                  Vamos começar<small>Entre ou crie seu personagem</small>
                </span>
                <span aria-hidden="true">↗</span>
              </Link>
              <div className="pocket-build">
                <span>● EMBER EDITION</span>
                <span>v0.1.0-alpha</span>
              </div>
            </div>
          </section>
          <section className="pocket-apps" aria-label="Explore seu sistema">
            <div className="pocket-apps-heading">
              <span>seu mundo, em movimento</span>
              <span aria-hidden="true">↓</span>
            </div>
            <div className="pocket-tiles">
              <Link to="/auth" className="pocket-tile tile-missions">
                <span className="tile-index">01 / FAZER</span>
                <Folder />
                <strong>missões</strong>
                <span>Um passo de cada vez.</span>
                <b aria-hidden="true">↗</b>
              </Link>
              <Link to="/auth" className="pocket-tile tile-progress">
                <span className="tile-index">02 / CRESCER</span>
                <Trophy />
                <strong>progresso</strong>
                <span>Cada conquista conta.</span>
                <b aria-hidden="true">↗</b>
              </Link>
              <Link to="/auth" className="pocket-tile tile-character">
                <span className="tile-index">03 / SER</span>
                <User />
                <strong>personagem</strong>
                <span>Conheça sua melhor versão.</span>
                <b aria-hidden="true">↗</b>
              </Link>
              <div className="pocket-tile tile-note">
                <div className="note-title">
                  <Star />
                  <span>lembrete.txt</span>
                </div>
                <p>
                  Você não precisa
                  <br />
                  fazer tudo hoje.
                  <br />
                  <strong>Só começar.</strong>
                </p>
                <span>salvo para você ♥</span>
              </div>
            </div>
          </section>
        </div>
        <div className="pocket-bottom">
          <span>FEITO PARA A VIDA REAL. E PARA O SEU BOLSO.</span>
          <span>* nostalgia de 1997. possibilidades de hoje.</span>
        </div>
      </main>
      <EmberStatus />
    </div>
  );
}
