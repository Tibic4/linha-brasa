"use client";

export default function Footer() {
  return (
    <footer className="bg-brasa-bg border-t border-brasa-border py-12 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-brasa-orange rounded-lg flex items-center justify-center">
              <span className="font-bebas text-white text-lg">B</span>
            </div>
            <span className="font-bebas text-xl tracking-wider">
              LINHA <span className="text-brasa-orange">BRASA</span>
            </span>
          </div>
          <p className="text-brasa-gray text-sm leading-relaxed">
            Caldeiras a lenha para aquecimento de piscinas. Fabricação própria em Londrina/PR.
          </p>
        </div>

        <div>
          <h4 className="font-bebas text-lg mb-4 text-brasa-orange">PRODUTOS</h4>
          <ul className="space-y-2 text-sm text-brasa-gray">
            <li><a href="/configurador" className="hover:text-brasa-orange transition-colors">BRASA 15</a></li>
            <li><a href="/configurador" className="hover:text-brasa-orange transition-colors">BRASA 25</a></li>
            <li><a href="/configurador" className="hover:text-brasa-orange transition-colors">BRASA 35</a></li>
            <li><a href="/configurador" className="hover:text-brasa-orange transition-colors">BRASA 50</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bebas text-lg mb-4 text-brasa-orange">LINKS</h4>
          <ul className="space-y-2 text-sm text-brasa-gray">
            <li><a href="#calculadora" className="hover:text-brasa-orange transition-colors">Calculadora de Economia</a></li>
            <li><a href="#faq" className="hover:text-brasa-orange transition-colors">Perguntas Frequentes</a></li>
            <li><a href="#contato" className="hover:text-brasa-orange transition-colors">Contato</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bebas text-lg mb-4 text-brasa-orange">CONTATO</h4>
          <ul className="space-y-2 text-sm text-brasa-gray">
            <li>Londrina, PR — Brasil</li>
            <li>(43) 99999-9999</li>
            <li>contato@linhabrasa.com.br</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-brasa-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-brasa-gray-dark text-xs font-mono">
          &copy; {new Date().getFullYear()} Linha Brasa. Todos os direitos reservados.
        </p>
        <p className="text-brasa-gray-dark text-xs font-mono">
          CNPJ: XX.XXX.XXX/0001-XX
        </p>
      </div>
    </footer>
  );
}
