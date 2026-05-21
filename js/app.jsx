const { useEffect } = React;

  function hexToRgb(hex) {
    const h = (hex || '').replace('#','');
    const v = h.length === 3 ? h.split('').map(c=>c+c).join('') : h;
    const n = parseInt(v || '000000', 16);
    return [(n>>16)&255, (n>>8)&255, n&255];
  }
  function applyTweaks(t) {
    document.body.setAttribute('data-theme', t.theme || 'light');
    document.body.setAttribute('data-display', t.displayFont);
    document.body.setAttribute('data-density', t.density || 'comfortable');
    document.body.setAttribute('data-cursor', t.showCursor ? 'on' : 'off');
    document.body.setAttribute('data-marquee', t.showMarquee ? 'on' : 'off');
    document.body.setAttribute('data-hl', t.headlineStyle || 'mixed');

    const accent = typeof t.accent === 'string' ? t.accent : (t.accent && t.accent.color) || '#FF5A1F';
    const [r,g,b] = hexToRgb(accent);
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--accent-soft', `rgba(${r},${g},${b},0.12)`);
    document.documentElement.style.setProperty('--mq-dur', (t.marqueeSpeed || 60) + 's');

    const mq = document.querySelector('.marquee');
    if (mq) mq.style.display = t.showMarquee ? '' : 'none';
  }

  function App() {
    const [t, setTweak] = useTweaks(window.DART_TWEAKS);
    useEffect(() => { applyTweaks(t); }, [t]);

    return (
      <TweaksPanel title="DART · Tweaks">
        <TweakSection title="Theme">
          <TweakSelect
            label="Background"
            value={t.theme}
            onChange={v => setTweak('theme', v)}
            options={[
              {value:'light', label:'Paper (off-white)'},
              {value:'cream', label:'Cream'},
              {value:'slate', label:'Slate (cool grey)'},
              {value:'dark',  label:'Charcoal (dark)'},
            ]}
          />
          <TweakColor
            label="Accent"
            value={t.accent}
            onChange={v => setTweak('accent', v)}
            options={[
              '#FF5A1F','#E63946','#2EA8FF','#0A5BFF',
              '#1F8A5B','#C8FF3D','#7C3AED','#15151a'
            ]}
          />
        </TweakSection>

        <TweakSection title="Typography">
          <TweakRadio
            label="Display font"
            value={t.displayFont}
            onChange={v => setTweak('displayFont', v)}
            options={[
              {value:'grotesk', label:'Grotesk'},
              {value:'serif',   label:'Serif'},
              {value:'mono',    label:'Mono'},
            ]}
          />
          <TweakRadio
            label="Italic accent in headlines"
            value={t.headlineStyle}
            onChange={v => setTweak('headlineStyle', v)}
            options={[
              {value:'mixed', label:'On'},
              {value:'plain', label:'Off'},
            ]}
          />
        </TweakSection>

        <TweakSection title="Density">
          <TweakRadio
            label="Section spacing"
            value={t.density}
            onChange={v => setTweak('density', v)}
            options={[
              {value:'compact',     label:'Compact'},
              {value:'comfortable', label:'Comfort'},
              {value:'airy',        label:'Airy'},
            ]}
          />
        </TweakSection>

        <TweakSection title="Motion">
          <TweakToggle
            label="Custom cursor"
            value={t.showCursor}
            onChange={v => setTweak('showCursor', v)}
          />
          <TweakToggle
            label="Marquee strip"
            value={t.showMarquee}
            onChange={v => setTweak('showMarquee', v)}
          />
          <TweakSlider
            label="Marquee speed"
            value={t.marqueeSpeed}
            onChange={v => setTweak('marqueeSpeed', v)}
            min={10} max={180} step={5}
            suffix="s"
          />
        </TweakSection>
      </TweaksPanel>
    );
  }

  const root = document.createElement('div');
  document.body.appendChild(root);
  ReactDOM.createRoot(root).render(<App />);