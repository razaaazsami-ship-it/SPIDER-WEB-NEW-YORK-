import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

interface Building {
  x: number;
  width: number;
  height: number;
  spire?: boolean;
  windows: { x: number; y: number; on: boolean; color: string }[];
}

export const CityBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; isHovering: boolean }>({
    x: -1000,
    y: -1000,
    isHovering: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initBuildings();
    };

    window.addEventListener('resize', handleResize);

    // Generate Buildings
    let buildings: Building[] = [];
    const initBuildings = () => {
      buildings = [];
      let currentX = -20;
      const palette = ['#fbbf24', '#38bdf8', '#ef4444', '#f8fafc'];

      while (currentX < width + 60) {
        const bWidth = Math.floor(60 + Math.random() * 80);
        const bHeight = Math.floor(height * 0.28 + Math.random() * (height * 0.35));
        const spire = Math.random() > 0.65;
        const bWindows: { x: number; y: number; on: boolean; color: string }[] = [];

        const cols = Math.floor(bWidth / 14);
        const rows = Math.floor(bHeight / 20);

        for (let r = 2; r < rows; r++) {
          for (let c = 1; c < cols - 1; c++) {
            if (Math.random() > 0.45) {
              bWindows.push({
                x: c * 14 + 4,
                y: r * 20,
                on: Math.random() > 0.2,
                color: palette[Math.floor(Math.random() * palette.length)],
              });
            }
          }
        }

        buildings.push({
          x: currentX,
          width: bWidth,
          height: bHeight,
          spire,
          windows: bWindows,
        });

        currentX += bWidth - 8;
      }
    };

    initBuildings();

    // Generate Web Floating Particles
    const particles: Particle[] = [];
    const particleCount = Math.min(50, Math.floor(width / 30));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.5,
        radius: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.5,
        color: Math.random() > 0.6 ? '#e11d48' : Math.random() > 0.5 ? '#38bdf8' : '#e2e8f0',
      });
    }

    // Searchlights sweep angle
    let searchlightAngle1 = 0;
    let searchlightAngle2 = Math.PI / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        isHovering: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Sky Gradient: Deep NYC Night with Crimson & Electric Blue Nebula Hues
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#030712'); // Pure midnight
      skyGrad.addColorStop(0.45, '#090d1f'); // Deep cobalt
      skyGrad.addColorStop(0.8, '#180a1c'); // Crimson comic mist
      skyGrad.addColorStop(1, '#020617'); // Dark street base
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Distant Moon / Glowing Comic Orb
      const moonX = width * 0.82;
      const moonY = height * 0.18;
      const moonRadius = 42;
      const moonGrad = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 90);
      moonGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      moonGrad.addColorStop(0.3, 'rgba(225, 29, 72, 0.18)');
      moonGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.08)');
      moonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 90, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      // Moon subtle crater details
      ctx.fillStyle = 'rgba(226, 232, 240, 0.35)';
      ctx.beginPath();
      ctx.arc(moonX - 10, moonY - 8, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(moonX + 12, moonY + 10, 8, 0, Math.PI * 2);
      ctx.fill();

      // 3. Searchlights across the sky
      searchlightAngle1 = Math.sin(tick * 0.008) * 0.45;
      searchlightAngle2 = Math.cos(tick * 0.006) * 0.55;

      const drawSearchlight = (baseX: number, angle: number, color: string) => {
        ctx.save();
        ctx.translate(baseX, height * 0.7);
        ctx.rotate(angle);
        const lightGrad = ctx.createLinearGradient(0, 0, 0, -height * 0.9);
        lightGrad.addColorStop(0, color.replace('ALPHA', '0.22'));
        lightGrad.addColorStop(0.5, color.replace('ALPHA', '0.08'));
        lightGrad.addColorStop(1, color.replace('ALPHA', '0'));
        ctx.fillStyle = lightGrad;
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(-70, -height * 0.9);
        ctx.lineTo(70, -height * 0.9);
        ctx.lineTo(6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      drawSearchlight(width * 0.25, searchlightAngle1, 'rgba(56, 189, 248, ALPHA)');
      drawSearchlight(width * 0.7, searchlightAngle2, 'rgba(225, 29, 72, ALPHA)');

      // 4. Draw NYC Skyline Silhouette
      buildings.forEach((b) => {
        const topY = height - b.height;

        // Building Body
        ctx.fillStyle = '#060a14';
        ctx.fillRect(b.x, topY, b.width, b.height);

        // Building Rim Highlight (Subtle cyan/red glow along roofs)
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, topY, b.width, b.height);

        // Spire & Blinking Beacon
        if (b.spire) {
          const spireX = b.x + b.width / 2;
          ctx.beginPath();
          ctx.moveTo(spireX - 3, topY);
          ctx.lineTo(spireX, topY - 45);
          ctx.lineTo(spireX + 3, topY);
          ctx.fillStyle = '#0f172a';
          ctx.fill();

          // Blinking Red Warning Beacon for helicopters/superheroes
          const beaconFlash = (Math.sin(tick * 0.1) + 1) / 2;
          ctx.beginPath();
          ctx.arc(spireX, topY - 46, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${0.4 + beaconFlash * 0.6})`;
          ctx.fill();
        }

        // Windows
        b.windows.forEach((w) => {
          if (w.on) {
            ctx.fillStyle = w.color;
            ctx.globalAlpha = 0.55;
            ctx.fillRect(b.x + w.x, topY + w.y, 6, 8);
            ctx.globalAlpha = 1.0;
          }
        });
      });

      // 5. Interactive Spider-Web Network (Connected Nodes & Mouse Interaction)
      const mouse = mouseRef.current;
      ctx.lineWidth = 0.75;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle node
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle spider-web filaments
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.strokeStyle = 'rgba(241, 245, 249, ' + (1 - dist / 120) * 0.12 + ')';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Spider-web tension to mouse pointer
        if (mouse.isHovering) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < 160) {
            ctx.strokeStyle = `rgba(225, 29, 72, ${(1 - mDist / 160) * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Repel / Attract slightly
            p.x += (mdx / mDist) * 0.3;
            p.y += (mdy / mDist) * 0.3;
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // 6. Subtle Fog on the horizon
      const fogGrad = ctx.createLinearGradient(0, height * 0.8, 0, height);
      fogGrad.addColorStop(0, 'rgba(2, 6, 23, 0)');
      fogGrad.addColorStop(1, 'rgba(2, 6, 23, 0.85)');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, height * 0.8, width, height * 0.2);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Decorative Web Pattern Vignette in corners */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 60%, #020617 98%),
            radial-gradient(circle at 100% 0%, rgba(225, 29, 72, 0.15), transparent 40%),
            radial-gradient(circle at 0% 100%, rgba(37, 99, 235, 0.15), transparent 40%)`,
        }}
      />
    </div>
  );
};
