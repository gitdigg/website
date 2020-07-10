import React from 'react';

export class SquareAds extends React.Component {
  componentDidMount () {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

    render () {
    return (
        <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-6092006931253729"
            data-ad-slot="5966981359"
            data-ad-format="auto"
            data-full-width-responsive="true" />
    );
  }
}

export class ContentAds extends React.Component {
  componentDidMount () {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

    render () {
    return (
        <ins className="adsbygoogle"
            style={{ display: 'block', 'text-align': 'center' }}
            data-ad-client="ca-pub-6092006931253729"
            data-ad-slot="5029304208"
            data-ad-layout="in-article"
            data-ad-format="fluid"
            />
    );
  }
}
