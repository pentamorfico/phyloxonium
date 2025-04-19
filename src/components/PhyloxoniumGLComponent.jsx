import React, { useEffect, useRef } from 'react';
import Phyloxonium from '../core/PhyloxoniumGL';
import defaults from "@lib/defaults";

const PhyloxoniumGLComponent = (props) => {
  const mergedProps = { ...defaults, ...props }; // Merge defaults with props dynamically

  const containerRef = useRef(null);
  const phyloRef = useRef(null);

  useEffect(() => {
    if (!phyloRef.current && containerRef.current) {
      phyloRef.current = new Phyloxonium(
        containerRef.current,
        mergedProps,
        mergedProps.plugins // Use plugins from mergedProps
      );
    }
    return () => {
      if (phyloRef.current) {
        phyloRef.current.destroy();
        phyloRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (phyloRef.current) {
      phyloRef.current.setProps(mergedProps);
    }
  }, [props]); // Trigger useEffect whenever props change

  useEffect(() => {
    if (phyloRef.current) {
      phyloRef.current.setProps(mergedProps);
    }
  }, [props.lineWidth]); // Trigger useEffect when lineWidth changes

  return <div ref={containerRef} style={{ width: mergedProps.size.width, height: mergedProps.size.height }} />;
};

export default PhyloxoniumGLComponent;