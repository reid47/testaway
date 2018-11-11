const React = require('react');
const Logo = require(process.cwd() + '/core/Logo');

class Footer extends React.Component {
  docUrl(doc, language) {
    const { baseUrl } = this.props.config;
    return `${baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
  }

  pageUrl(doc, language) {
    const { baseUrl } = this.props.config;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    const { config, language } = this.props;

    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <div>
            <Logo height="80px" innerColor="#fff" outerColor="#fff" />
          </div>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('doc1.html', language)}>Getting Started</a>
            <a href={this.docUrl('doc2.html', language)}>Guides</a>
            <a href={this.docUrl('doc3.html', language)}>API Reference</a>
          </div>
          <div>
            <h5>More</h5>
            <a href={`${config.baseUrl}blog`}>Blog</a>
            <a href={config.repoUrl}>GitHub</a>
            <a href={`${config.repoUrl}/issues`}>Issues</a>
            <a
              className="github-button"
              href={config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
          </div>
        </section>

        <section className="copyright">{config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
