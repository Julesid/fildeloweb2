import { useEffect, useState } from 'react';

export default function SafeSpline({ scene, className }) {
  const [SplineComponent, setSplineComponent] = useState(null);

  useEffect(() => {
    import('@splinetool/react-spline')
      .then((mod) => setSplineComponent(() => mod.default))
      .catch(() => {
        console.warn('Spline non disponible, on continue sans.');
      });
  }, []);

  return SplineComponent ? (
    <SplineComponent scene={scene} className={className} />
  ) : null;
}
