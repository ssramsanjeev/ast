import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dashboard States
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [sigma, setSigma] = useState(null);
  const [frame, setFrame] = useState(null);
  const [loading, setLoading] = useState(false);

  const DEFAULTS = { thresh1: 35, thresh2: 70, frame1: 31, frame2: 58, frame3: 87, outputThreshold: 2047 };
  const [thresh1, setThresh1] = useState(DEFAULTS.thresh1);
  const [thresh2, setThresh2] = useState(DEFAULTS.thresh2);
  const [frame1, setFrame1] = useState(DEFAULTS.frame1);
  const [frame2, setFrame2] = useState(DEFAULTS.frame2);
  const [frame3, setFrame3] = useState(DEFAULTS.frame3);
  const [outputThreshold, setOutputThreshold] = useState(DEFAULTS.outputThreshold);

  // Codebase Sub-tab state
  const [codeSubTab, setCodeSubTab] = useState('python');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setProcessedImage(null);
      setSigma(null);
      setFrame(null);
    }
  };

  const handleReset = () => {
    setThresh1(DEFAULTS.thresh1);
    setThresh2(DEFAULTS.thresh2);
    setFrame1(DEFAULTS.frame1);
    setFrame2(DEFAULTS.frame2);
    setFrame3(DEFAULTS.frame3);
    setOutputThreshold(DEFAULTS.outputThreshold);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('thresh1', thresh1);
    formData.append('thresh2', thresh2);
    formData.append('frame1', frame1);
    formData.append('frame2', frame2);
    formData.append('frame3', frame3);
    formData.append('output_threshold', outputThreshold);

    setLoading(true);
   const response = await fetch(
  `${import.meta.env.VITE_API_URL}/process-image`,
  {
    method: 'POST',
    body: formData,
  }
);

if (!response.ok) {
  throw new Error(`Image processing failed: ${response.status}`);
}

const result = await response.json();

      const data = await response.json();
      if (response.ok) {
        setProcessedImage(`data:image/png;base64,${data.processed_image}`);
        setSigma(data.sigma);
        setFrame(data.frame);
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error connecting to backend:', err);
      alert('Failed to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <h2>ASTERION</h2>
        <p className="subtitle">Research Portal</p>
        <nav>
          <button 
            className={activeTab === 'dashboard' ? 'nav-btn active' : 'nav-btn'} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'research' ? 'nav-btn active' : 'nav-btn'} 
            onClick={() => setActiveTab('research')}
          >
            Research & Notes
          </button>
          <button 
            className={activeTab === 'codebase' ? 'nav-btn active' : 'nav-btn'} 
            onClick={() => setActiveTab('codebase')}
          >
            Codebase
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="content">
        {activeTab === 'dashboard' && (
          <div className="section-view">
            <h2>Interactive Dashboard</h2>
            <p className="section-desc">Upload a grayscale image to evaluate its standard deviation and execute the ASTERION algorithm.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="file-input-group">
                <label>Upload Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              <fieldset>
                <div className="fieldset-header">
                  <legend><strong>Parameters</strong></legend>
                  <button type="button" className="reset-btn" onClick={handleReset}>Reset Defaults</button>
                </div>
                
                <div className="params-grid">
                  <div className="param-item"><label>Threshold 1</label><input type="number" value={thresh1} onChange={(e) => setThresh1(e.target.value)} /></div>
                  <div className="param-item"><label>Threshold 2</label><input type="number" value={thresh2} onChange={(e) => setThresh2(e.target.value)} /></div>
                  <div className="param-item"><label>Frame 1</label><input type="number" value={frame1} onChange={(e) => setFrame1(e.target.value)} /></div>
                  <div className="param-item"><label>Frame 2</label><input type="number" value={frame2} onChange={(e) => setFrame2(e.target.value)} /></div>
                  <div className="param-item"><label>Frame 3</label><input type="number" value={frame3} onChange={(e) => setFrame3(e.target.value)} /></div>
                  <div className="param-item"><label>Output Threshold</label><input type="number" min="0" max="65535" value={outputThreshold} onChange={(e) => setOutputThreshold(e.target.value)} /></div>
                </div>
              </fieldset>

              <button type="submit" className="submit-btn" disabled={!imageFile || loading}>
                {loading ? 'Processing...' : 'Process Image'}
              </button>
            </form>

            <div className="results-container">
              {preview && (
                <div className="image-card">
                  <h3>Original Image</h3>
                  <img src={preview} alt="Original preview" />
                </div>
              )}
              {processedImage && (
                <div className="image-card">
                  <h3>Processed Output</h3>
                  <img src={processedImage} alt="Processed result" />
                  <div className="metadata-box">
                    <p><strong>Standard Deviation (σ):</strong> {sigma !== null ? sigma.toFixed(2) : 'N/A'}</p>
                    <p><strong>Selected Frame:</strong> {frame !== null ? frame : 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'research' && (
          <div className="section-view">
            <h2>Research & Notes</h2>
            <p className="section-desc">Comprehensive documentation of the ASTERION architecture, algorithmic flow, execution benchmarks, synthesis metrics, and structural diagrams.</p>
            
            {/* System Architecture & Multiplier Diagrams Section */}
            <div className="doc-card" style={{ marginBottom: '20px' }}>
              <h3>Architectural Diagrams</h3>
              <p>Visual representation of the overall ASTERION pipeline and the modified Nikhilam multiplier hardware.</p>
              
              <div className="diagram-grid" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
                <div style={{ flex: 1, minWidth: '280px', textAlign: 'center' }}>
                  <img src="/asterion_system.png" alt="ASTERION System Architecture" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}><strong>Fig 1:</strong> Complete ASTERION Data Flow Architecture</p>
                </div>
                <div style={{ flex: 1, minWidth: '280px', textAlign: 'center' }}>
                  <img src="/nikhilam_multiplier.png" alt="Modified Nikhilam Multiplier" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}><strong>Fig 2:</strong> Modified Nikhilam Multiplier Block Diagram</p>
                </div>
                <div style={{ flex: 1, minWidth: '280px', textAlign: 'center' }}>
                  <img src="/nik_pix.png" alt="Modified Nikhilam Multiplier" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}><strong>Fig 3:</strong> Comparison of Output image when Frame is multiplied with an Input image</p>
                </div>
                <div style={{ flex: 1, minWidth: '280px', textAlign: 'center' }}>
                  <img src="/ex.png" alt="Modified Nikhilam Multiplier" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}><strong>Fig 4:</strong> Examples </p>
                </div>
              </div>
            </div>

            {/* Software Execution-Time Evaluation Table */}
            <div className="doc-card" style={{ marginBottom: '20px' }}>
              <h3>Software Execution-Time Evaluation</h3>
              <p>Experimental benchmark conditions and runtime comparison across ASTERION, Sobel, and Canny implementations:</p>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Testing condition</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>ASTERION</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Sobel</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Canny</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Input image</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Same 256x256 grayscale image</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Same</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Same</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Warm-up runs</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>5</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>5</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>5</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Timed runs</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>100</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>100</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>100</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Timer</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><code>time.perf_counter()</code></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><code>time.perf_counter()</code></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><code>time.perf_counter()</code></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Image loading</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Excluded</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Excluded</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Excluded</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Image resizing</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Excluded</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Excluded</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Excluded</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Output saving</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Excluded</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Excluded</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>Excluded</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}><strong>Mean (ms)</strong></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><strong>1.4764</strong></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><strong>2.5305</strong></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><strong>0.4473</strong></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}><strong>Median (ms)</strong></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><strong>1.3801</strong></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><strong>2.1517</strong></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><strong>0.4524</strong></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                      <td style={{ padding: '8px' }}><strong>Std. (ms)</strong></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><strong>0.2759</strong></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><strong>1.1033</strong></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}><strong>0.0601</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 1. Abstract & Overview */}
            <div className="doc-card" style={{ marginBottom: '20px' }}>
              <h3>1. Abstract & Overview</h3>
              <p>
                This invention ASTERION (Adaptive STatistics-based Edge-detection
using Integrated Optimized Nikhilam), is a hardware-efficient nonlinear image
edge detection architecture based on the Nikhilam Sutra multiplication technique and global adaptive frame selection. Unlike conventional convolution-based
approaches that rely on multiple multiplication-and-accumulation operations,
ASTERION employs a simplified nonlinear arithmetic mechanism to extract
meaningful edge information with reduced hardware complexity. The generated edge maps are evaluated through downstream image classification using
MobileNetV2 and ResNet18 on three classes from the Animals-10 dataset, achieving a peak classification accuracy of 76.67% with both networks. Software
execution-time evaluation on a 256 × 256 grayscale image yielded mean runtimes of 1.4764 ms for ASTERION, 2.5305 ms for Sobel, and 0.4473 ms for
Canny. Artix-7 FPGA implementation demonstrated an 88.6% reduction in LUT
utilization, zero register utilization in the evaluated implementation, a 17.98%
reduction in power consumption, and a 57.87% reduction in critical-path delay
compared with a conventional 3 × 3 convolution kernel synthesized under identical design conditions. ASIC evaluation using GPDK 90 nm technology achieved a
91.23% reduction in silicon area, a 28.00% reduction in power consumption, and
a 44.28% reduction in delay, alongside improvements of 95.12% and 59.88% in the
area-delay product (ADP) and power-delay product (PDP), respectively. These
results demonstrate ASTERION’s potential to balance edge extraction capability
with hardware efficiency, making it a promising solution for resource-constrained
FPGA and ASIC image processing applications.
              </p>
            
            </div>

            {/* 2. Step-by-Step Architecture Pipeline */}
            <div className="doc-card" style={{ marginBottom: '20px' }}>
              <h3>2. Architectural Processing Steps (I x F)</h3>
              <p>Let I be a 256x256 pixel 8-bit grayscale input image and F be an 256x256 pixel 8-bit operating frame , with Z representing the final output:</p>
              <ol style={{ paddingLeft: '20px', color: '#334155', lineHeight: '1.7' }}>
                <li><strong>Input Stream:</strong> A grayscale input image (I) is streamed pixel-by-pixel, where each pixel represents a distinct intensity value.</li>
                <li><strong>Statistical Computation:</strong> The mean (mu) and standard deviation (sigma) of pixel intensities are computed for the input image I to gauge edge activity.</li>
                <li><strong>Adaptive Frame Selection:</strong> Based on sigma, an operating frame (F) is chosen: <strong>Black 9</strong>(Frame 1) for low edge activity (sigma &lt; 35, Threshold 1), <strong>Black 8</strong> (Frame 2) for moderate variation (35 &le; sigma &lt; 70, Threshold 2), and <strong>Black 7</strong> (Frame 3) for high variation (sigma &ge; 70).</li>
                <li><strong>Multiplier Interfacing:</strong> The selected frame (F) is passed alongside input pixels (I) to the nonlinear Nikhilam Sutra multiplier block.</li>
                <li><strong>Modified Nikhilam Multiplication:</strong> Each pixel is multiplied using the modified Nikhilam operation, producing an initial nonlinear response output (Z).</li>
                <li><strong>Amplification Control:</strong> Darker frames (e.g., Black 9) produce stronger nonlinear responses to enhance low-contrast edges, whereas lighter/milder frames (e.g., Black 7) handle pronounced edges.</li>
                <li><strong>Response Representation:</strong> Edge regions generate distinctly amplified output values compared to uniform background zones.</li>
                <li><strong>Threshold Compression:</strong> A predetermined threshold level (0000011111111111) is applied to map values into binary classes.</li>
                <li><strong>Binary Edge Map Generation:</strong> Output pixels satisfying the condition map to white (1111111111111111), while suppressed pixels map to black (0000000000000000).</li>
                <li><strong>Pipeline Integration:</strong> The complete pipeline unifies statistical analysis, adaptive frame selection, nonlinear Nikhilam multiplication, and threshold compression into a single low-complexity hardware block.</li>
              </ol>
            </div>

            {/* 3. Comparison with Prior Art */}
            <div className="doc-card" style={{ marginBottom: '20px' }}>
              <h3>3. Comparative Analysis Against Prior Art</h3>
              <ul style={{ paddingLeft: '20px', color: '#334155', lineHeight: '1.7' }}>
                <li><strong>Convolution Elimination:</strong> Conventional Sobel and Canny detectors rely heavily on spatial convolution and gradient calculations, whereas ASTERION replaces MAC operations entirely with a nonlinear Nikhilam Sutra multiplication.</li>
                <li><strong>Reduced Processing Stages:</strong> Canny requires multiple sequential steps (Gaussian smoothing, gradient calculation, non-maximum suppression, double thresholding, hysteresis). ASTERION condenses these into a streamlined architecture.</li>
                <li><strong>Nonlinear Domain Classification:</strong> Unlike conventional edge detectors that classify directly from linear gradients, ASTERION performs binary classification inside an amplified nonlinear response domain.</li>
                <li><strong>Resource Efficiency:</strong> ASTERION achieves dramatic hardware reductions in FPGA LUTs, register counts, power, critical-path delay, silicon area, Area-Delay Product (ADP), and Power-Delay Product (PDP).</li>
              </ul>
            </div>

            {/* 4. Complete Synthesis & Hardware Metrics */}
            <div className="doc-card" style={{ marginBottom: '20px' }}>
              <h3>4. Hardware Synthesis & Performance Metrics</h3>
              <p>Detailed comparison table summarizing FPGA (Artix-7 AC701) and ASIC (Cadence GPDK 90nm slow corner) results[cite: 1]:</p>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Architecture / Technique</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>FPGA LUTs</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>FPGA Registers</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>FPGA Power</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>FPGA Delay (ns)</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>ASIC Area</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>ASIC Power</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>ASIC Delay</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>ASIC ADP</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>ASIC PDP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}><strong>3x3 Convolution Kernel</strong></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>920</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>224</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>0.178 </td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>23.66</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>52,389.648</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>46.25</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>5.617</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>294,272.6</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>259.78</td>
                    </tr>
                    
                    <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                      <td style={{ padding: '8px' }}><strong>Proposed Nikhilam Sutra used in ASTERION</strong></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>105</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>0</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>0.146</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>9.969</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>4,592.772</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>33.33</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>3.13</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>14,375.373</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>104.229</td>
                    
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Downstream CNN Classification Evaluation */}
            <div className="doc-card">
              <h3>5. Future Scope</h3>
              <p>
                The current ASTERION architecture employs threshold and frame values selected through manual experimentation, evaluating ten candidate configurations and choosing the most suitable combination based on general image characteristics. However, specialized applications such as medical imaging and defense image analysis may require more application-specific edge detection.
              </p>
              <p>
                Future work could explore dataset-specific parameter optimization by evaluating multiple threshold and frame configurations across representative images from a target dataset. The resulting edge maps could be compared against conventional Sobel and Canny operators using appropriate edge-quality metrics and application-specific requirements. The optimal configuration could then be identified to improve edge preservation and detection performance for the intended dataset.
              </p>
              <p>
                Although this optimization process would require additional computational resources during the development and calibration phase, the selected parameters could subsequently be deployed in the ASTERION hardware architecture, potentially retaining its computational efficiency during inference. This approach could enable application-oriented configurations for specialized image-processing tasks.
              </p>
            </div>

            <div className="doc-card" style={{ marginTop: '20px' }}>
              <h3>6. Research Manuscript Submission</h3>
              <p>
                A detailed research manuscript describing ASTERION has been submitted to a journal for consideration. The manuscript brings together the architecture and algorithmic design, AI-driven graph-to-circuit synthesis, local adaptive frame selection, hardware implementation and evaluation, future research directions, and supporting images and graphs.
              </p>
              <p>
                The submission is currently under the journal's review process. The publication link and final citation will be added to this section once the paper is officially published.
              </p>
              <p>
                Until publication, the manuscript should be treated as submitted work rather than a published article.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'codebase' && (
          <div className="section-view">
            <h2>Codebase Repository</h2>
            <p className="section-desc">Explore the software simulation and hardware implementation scripts.</p>
            
            <div className="sub-tabs">
              <button className={codeSubTab === 'python' ? 'sub-btn active' : 'sub-btn'} onClick={() => setCodeSubTab('python')}>Python</button>
              <button className={codeSubTab === 'verilog' ? 'sub-btn active' : 'sub-btn'} onClick={() => setCodeSubTab('verilog')}>Verilog(RTL) for ASTERION system</button>
              <button className={codeSubTab === 'verilog_nik' ? 'sub-btn active' : 'sub-btn'} onClick={() => setCodeSubTab('verilog_nik')}>Verilog (RTL) for Nikhilam multiplier</button>
               <button className={codeSubTab === 'verilog_sys' ? 'sub-btn active' : 'sub-btn'} onClick={() => setCodeSubTab('verilog_sys')}>Verilog Testbench(RTL) for ASTERION system</button>
            </div>

            {codeSubTab === 'python' && (
              <div className="code-block-container">
                <h3>Python Simulation Logic</h3>
                <pre><code>{`import numpy as np
import time
import cv2
import matplotlib.pyplot as plt

def top_vectorized(image, f):
    i = image.astype(np.uint16) & 0xFF
    f = int(f) & 0xFF
    i2 = ((~i) + 1) & 0xFF
    f2 = ((~f) + 1) & 0xFF
    i21 = i2 & 0x7F
    f21 = f2 & 0x7F
    mult = (i21 * f21) & 0x3FFF
    l = (f - i2) & 0xFF
    final = ((l << 8) + mult) & 0xFFFF
    output = np.where(final < 2047, 0, 255)
    return output.astype(np.uint8)

def process_asterion(image):
    sigma = np.std(image.astype(np.float64))
    if sigma < 35:
        Frame = 31
    elif sigma < 70:
        Frame = 58
    else:
        Frame = 87
    output8 = top_vectorized(image, Frame)
    return output8, sigma, Frame

image = cv2.imread(
    r"F:\deep\dataset_original\elephant\e1.jpeg",
    cv2.IMREAD_GRAYSCALE
)

if image is None:
    raise FileNotFoundError("Could not load the input image.")

for _ in range(5):
    process_asterion(image)

times = []

for _ in range(100):
    start = time.perf_counter()
    output8, sigma, Frame = process_asterion(image)
    times.append((time.perf_counter() - start) * 1000)

times = np.array(times)

print(f"Image size: {image.shape[1]} x {image.shape[0]}")
print(f"Standard deviation: {sigma:.4f}")
print(f"Selected Frame: {Frame}")
print(f"Mean execution time:      {times.mean():.4f} ms")
print(f"Median execution time:    {np.median(times):.4f} ms")
print(f"Standard deviation:       {times.std(ddof=1):.4f} ms")

plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.imshow(image, cmap="gray", vmin=0, vmax=255)
plt.title("Original Image")
plt.axis("off")

plt.subplot(1, 2, 2)
plt.imshow(output8, cmap="gray", vmin=0, vmax=255)
plt.title(f"ASTERION Output (Frame = {Frame})")
plt.axis("off")

plt.tight_layout()
plt.show()`}</code></pre>
              </div>
            )}

            {codeSubTab === 'verilog_sys' && (
              <div className="code-block-container">
                <h3>Python Simulation Logic</h3>
                <pre><code>{`module tb_asterion;

    reg [7:0] data;
    reg clk;
    reg valid;
    reg rst;
    reg r_en;

    wire done_s;
    wire edge_valid;
    wire edge_out;

    a uut (
        .data(data),
        .clk(clk),
        .valid(valid),
        .rst(rst),
        .r_en(r_en),
        .done_s(done_s),
        .edge_valid(edge_valid),
        .edge_out(edge_out)
    );

    always #5 clk = ~clk;

    integer input_file;
    integer output_file;
    integer status;

    integer i;
    reg [7:0] pixel;

    reg reading_done;

    initial begin

        clk = 0;
        rst = 1;
        valid = 0;
        r_en = 0;
        data = 8'd0;
        reading_done = 0;

        #10;
        rst = 0;

        input_file = $fopen("F:/deep/duplicate/cane_binary/d6.txt", "r");

        if (input_file == 0) begin
            $display("ERROR: Could not open input file!");
            $finish;
        end

        $display("--------------------------------------------");
        $display("Input file opened successfully.");
        $display("Starting image load...");
        $display("--------------------------------------------");

        valid = 1;

        for (i = 0; i < 65536; i = i + 1) begin

            status = $fscanf(input_file, "%b\n", pixel);

            if (status != 1) begin
                $display("ERROR: Could not read pixel %0d", i);
                $fclose(input_file);
                $finish;
            end

            data = pixel;

            #10;
        end

        valid = 0;

        $fclose(input_file);

        $display("--------------------------------------------");
        $display("Image Load Complete.");
        $display("65536 pixels loaded.");
        $display("Internal processing started.");
        $display("--------------------------------------------");

        wait(done_s == 1'b1);

        $display("--------------------------------------------");
        $display("Processing Finished.");
        $display("--------------------------------------------");

        #50;

        output_file = $fopen("processed_edge_out_6.txt", "w");

        if (output_file == 0) begin
            $display("ERROR: Could not open output file!");
            $finish;
        end

        $display("Starting Output Read Phase...");

        #10;
        r_en = 1;

        #10;
        r_en = 0;

        reading_done = 0;

        while (!reading_done) begin

            @(posedge clk);

            if (edge_valid) begin
                $fwrite(output_file, "%b\n", edge_out);
            end

            if (uut.done_o) begin
                reading_done = 1;
            end

        end

        $fclose(output_file);

        $display("--------------------------------------------");
        $display("Output Read Complete.");
        $display("Output saved to processed_edge_out_4.txt");
        $display("--------------------------------------------");

        #100;

        $finish;

    end

endmodule`}</code></pre>
              </div>
            )}

            {codeSubTab === 'verilog_nik' && (
              <div className="code-block-container">
                <h3>Verilog Hardware Implementation</h3>
                <pre><code>{`module half_subtractor(
    input a,b,
    output diff,Bout
);
    assign diff=a^b;
    wire x;
    assign x=~a;
    assign Bout=x&b;
endmodule

module full_subtractor(
    input a,b,Bin,
    output diff,Bout
);
    wire in1,in2,in3,in4,in5;
    wire x;
    assign x=~a;
    assign in1=a^b;
    assign diff=in1^Bin;
    assign in2=x&b;
    assign in3=b&Bin;
    assign in4=x&Bin;
    assign in5=in2|in3;
    assign Bout=in4|in5;   
endmodule

module half_adder(
    input wire a,b,
    output wire sum,carry
    );    
    assign sum=a^b;
    assign carry=a&b;    
endmodule

module full_adder(
    input wire a,b,cin,
    output wire sum,carry
    );    
    wire in1,in2,in3,in4,in5;
    assign in1=a^b;
    assign sum=in1^cin;
    assign in2=a&b;
    assign in3=b&cin;
    assign in4=a&cin;
    assign in5=in2|in3;
    assign carry=in4|in5;    
endmodule

module nik(
    //input clk,
    input [7:0]p,q,
    output [15:0] final//,re
    );
    //assign re=p*q;
    wire [7:0] qbar;
    wire [7:0] pbar;
    assign qbar=~q;
    assign pbar=~p;
    
    //2's compliment of p
    
    wire [6:0] p2;
    wire [5:0] carry1;
    
    half_adder ha100(.a(pbar[0]),.b(1'b1),.sum(p2[0]),.carry(carry1[0]));
    half_adder ha101(.a(pbar[1]),.b(carry1[0]),.sum(p2[1]),.carry(carry1[1]));
    half_adder ha102(.a(pbar[2]),.b(carry1[1]),.sum(p2[2]),.carry(carry1[2]));
    half_adder ha103(.a(pbar[3]),.b(carry1[2]),.sum(p2[3]),.carry(carry1[3]));
    half_adder ha104(.a(pbar[4]),.b(carry1[3]),.sum(p2[4]),.carry(carry1[4]));
    half_adder ha105(.a(pbar[5]),.b(carry1[4]),.sum(p2[5]),.carry(carry1[5]));
    half_adder ha106(.a(pbar[6]),.b(carry1[5]),.sum(p2[6]),.carry());
    
    //2's compliment of q
    
    wire [6:0] q2;
    wire [5:0] carry2;
    
    half_adder ha200(.a(qbar[0]),.b(1'b1),.sum(q2[0]),.carry(carry2[0]));
    half_adder ha201(.a(qbar[1]),.b(carry2[0]),.sum(q2[1]),.carry(carry2[1]));
    half_adder ha202(.a(qbar[2]),.b(carry2[1]),.sum(q2[2]),.carry(carry2[2]));
    half_adder ha203(.a(qbar[3]),.b(carry2[2]),.sum(q2[3]),.carry(carry2[3]));
    half_adder ha204(.a(qbar[4]),.b(carry2[3]),.sum(q2[4]),.carry(carry2[4]));
    half_adder ha205(.a(qbar[5]),.b(carry2[4]),.sum(q2[5]),.carry(carry2[5]));
    half_adder ha206(.a(qbar[6]),.b(carry2[5]),.sum(q2[6]),.carry());
    
    //rhs
    //wire [13:0] rhs;
    //assign rhs=p2*q2;
    
    //square of out6[6:0]
    
    wire mul[6:0][6:0];
    genvar i1,j1;
    generate 
        for(i1=0;i1<7;i1=i1+1) begin
            for(j1=0;j1<7;j1=j1+1) begin
                 assign mul[i1][j1]=p2[j1]&q2[i1];
            end
        end
    endgenerate   
    
    wire out8[13:0];
    
    assign out8[0]=mul[0][0];
    
    wire inb3[15:0];
    wire incar4[15:0];
    
    half_adder ha900(.a(mul[0][1]),.b(mul[1][0]),.sum(inb3[0]),.carry(incar4[0]));
    full_adder fa901(.a(mul[0][2]),.b(mul[1][1]),.cin(mul[2][0]),.sum(inb3[1]),.carry(incar4[1]));
    full_adder fa902(.a(mul[0][3]),.b(mul[1][2]),.cin(mul[2][1]),.sum(inb3[2]),.carry(incar4[2]));
    full_adder fa903(.a(mul[0][4]),.b(mul[1][3]),.cin(mul[2][2]),.sum(inb3[3]),.carry(incar4[3]));
    half_adder ha904(.a(mul[3][1]),.b(mul[4][0]),.sum(inb3[4]),.carry(incar4[4]));
    full_adder fa905(.a(mul[0][5]),.b(mul[1][4]),.cin(mul[2][3]),.sum(inb3[5]),.carry(incar4[5]));
    full_adder fa906(.a(mul[3][2]),.b(mul[4][1]),.cin(mul[5][0]),.sum(inb3[6]),.carry(incar4[6]));
    full_adder fa907(.a(mul[0][6]),.b(mul[1][5]),.cin(mul[2][4]),.sum(inb3[7]),.carry(incar4[7]));
    full_adder fa908(.a(mul[3][3]),.b(mul[4][2]),.cin(mul[5][1]),.sum(inb3[8]),.carry(incar4[8]));
    full_adder fa909(.a(mul[1][6]),.b(mul[2][5]),.cin(mul[3][4]),.sum(inb3[9]),.carry(incar4[9]));
    full_adder fa910(.a(mul[4][3]),.b(mul[5][2]),.cin(mul[6][1]),.sum(inb3[10]),.carry(incar4[10]));
    full_adder fa911(.a(mul[2][6]),.b(mul[3][5]),.cin(mul[4][4]),.sum(inb3[11]),.carry(incar4[11]));
    half_adder ha912(.a(mul[5][3]),.b(mul[6][2]),.sum(inb3[12]),.carry(incar4[12]));
    full_adder fa913(.a(mul[3][6]),.b(mul[4][5]),.cin(mul[5][4]),.sum(inb3[13]),.carry(incar4[13]));
    full_adder fa914(.a(mul[4][6]),.b(mul[5][5]),.cin(mul[6][4]),.sum(inb3[14]),.carry(incar4[14]));
    half_adder ha915(.a(mul[5][6]),.b(mul[6][5]),.sum(inb3[15]),.carry(incar4[15]));
    
    assign out8[1]=inb3[0];
    
    wire inb4[11:0];
    wire incar5[11:0];
    
    half_adder hax100(.a(incar4[0]),.b(inb3[1]),.sum(inb4[0]),.carry(incar5[0]));
    full_adder fax101(.a(incar4[1]),.b(inb3[2]),.cin(mul[3][0]),.sum(inb4[1]),.carry(incar5[1]));
    full_adder fax102(.a(incar4[2]),.b(inb3[3]),.cin(inb3[4]),.sum(inb4[2]),.carry(incar5[2]));
    full_adder fax103(.a(incar4[3]),.b(incar4[4]),.cin(inb3[5]),.sum(inb4[3]),.carry(incar5[3]));
    full_adder fax104(.a(incar4[5]),.b(incar4[6]),.cin(inb3[7]),.sum(inb4[4]),.carry(incar5[4]));
    half_adder hax105(.a(inb3[8]),.b(mul[6][0]),.sum(inb4[5]),.carry(incar5[5]));
    full_adder fax106(.a(incar4[7]),.b(incar4[8]),.cin(inb3[9]),.sum(inb4[6]),.carry(incar5[6]));
    full_adder fax107(.a(incar4[9]),.b(incar4[10]),.cin(inb3[11]),.sum(inb4[7]),.carry(incar5[7]));
    full_adder fax108(.a(incar4[11]),.b(incar4[12]),.cin(inb3[13]),.sum(inb4[8]),.carry(incar5[8]));
    half_adder hax109(.a(incar4[13]),.b(inb3[14]),.sum(inb4[9]),.carry(incar5[9]));
    half_adder hax110(.a(incar4[14]),.b(inb3[15]),.sum(inb4[10]),.carry(incar5[10]));
    half_adder hax111(.a(incar4[15]),.b(mul[6][6]),.sum(inb4[11]),.carry(incar5[11]));
    
    assign out8[2]=inb4[0];
    
    wire inb5[9:0];
    wire incar6[9:0];
    
    half_adder hax200(.a(incar5[0]),.b(inb4[1]),.sum(inb5[0]),.carry(incar6[0]));
    full_adder fax201(.a(incar5[1]),.b(inb4[2]),.cin(incar6[0]),.sum(inb5[1]),.carry(incar6[1]));
    full_adder fax202(.a(incar5[2]),.b(inb4[3]),.cin(inb3[6]),.sum(inb5[2]),.carry(incar6[2]));
    full_adder fax203(.a(incar5[3]),.b(inb4[4]),.cin(inb4[5]),.sum(inb5[3]),.carry(incar6[3]));
    full_adder fax204(.a(incar5[4]),.b(incar5[5]),.cin(inb4[6]),.sum(inb5[4]),.carry(incar6[4]));
    full_adder fax205(.a(incar5[6]),.b(inb4[7]),.cin(inb3[12]),.sum(inb5[5]),.carry(incar6[5]));
    full_adder fax206(.a(incar5[7]),.b(inb4[8]),.cin(mul[6][3]),.sum(inb5[6]),.carry(incar6[6]));
    half_adder hax207(.a(incar5[8]),.b(inb4[9]),.sum(inb5[7]),.carry(incar6[7]));
    half_adder hax208(.a(incar5[9]),.b(inb4[10]),.sum(inb5[8]),.carry(incar6[8]));
    half_adder hax209(.a(incar5[10]),.b(inb4[11]),.sum(inb5[9]),.carry(incar6[9]));
    
    assign out8[3]=inb5[0];
    assign out8[4]=inb5[1];
    
    wire inb6[8:0];
    wire incar7[7:0];
    
    half_adder hax300(.a(incar6[1]),.b(inb5[2]),.sum(inb6[0]),.carry(incar7[0]));
    full_adder fax301(.a(incar6[2]),.b(inb5[3]),.cin(incar7[0]),.sum(inb6[1]),.carry(incar7[1]));
    full_adder fax302(.a(incar6[3]),.b(inb5[4]),.cin(inb3[10]),.sum(inb6[2]),.carry(incar7[2]));
    half_adder hax303(.a(incar6[4]),.b(inb5[5]),.sum(inb6[3]),.carry(incar7[3]));
    half_adder hax304(.a(incar6[5]),.b(inb5[6]),.sum(inb6[4]),.carry(incar7[4]));
    half_adder hax305(.a(incar6[6]),.b(inb5[7]),.sum(inb6[5]),.carry(incar7[5]));
    half_adder hax306(.a(incar6[7]),.b(inb5[8]),.sum(inb6[6]),.carry(incar7[6]));
    half_adder hax307(.a(incar6[8]),.b(inb5[9]),.sum(inb6[7]),.carry(incar7[7]));
    half_adder hax308(.a(incar6[9]),.b(incar5[11]),.sum(inb6[8]),.carry());
    
    assign out8[5]=inb6[0];
    assign out8[6]=inb6[1];
    
    wire incar8[5:0];
    
    half_adder hax400(.a(incar7[1]),.b(inb6[2]),.sum(out8[7]),.carry(incar8[0]));
    full_adder fax401(.a(incar7[2]),.b(inb6[3]),.cin(incar8[0]),.sum(out8[8]),.carry(incar8[1]));
    full_adder fax402(.a(incar7[3]),.b(inb6[4]),.cin(incar8[1]),.sum(out8[9]),.carry(incar8[2]));
    full_adder fax403(.a(incar7[4]),.b(inb6[5]),.cin(incar8[2]),.sum(out8[10]),.carry(incar8[3]));
    full_adder fax404(.a(incar7[5]),.b(inb6[6]),.cin(incar8[3]),.sum(out8[11]),.carry(incar8[4]));
    full_adder fax405(.a(incar7[6]),.b(inb6[7]),.cin(incar8[4]),.sum(out8[12]),.carry(incar8[5]));
    full_adder fax406(.a(incar7[7]),.b(inb6[8]),.cin(incar8[5]),.sum(out8[13]),.carry());
    
    //p - q2
    
    wire [7:0] l;
    wire [6:0] carry3;
    half_subtractor hs300(.a(p[0]),.b(q2[0]),.diff(l[0]),.Bout(carry3[0]));
    full_subtractor fs301(.a(p[1]),.b(q2[1]),.Bin(carry3[0]),.diff(l[1]),.Bout(carry3[1]));
    full_subtractor fs302(.a(p[2]),.b(q2[2]),.Bin(carry3[1]),.diff(l[2]),.Bout(carry3[2]));
    full_subtractor fs303(.a(p[3]),.b(q2[3]),.Bin(carry3[2]),.diff(l[3]),.Bout(carry3[3]));
    full_subtractor fs304(.a(p[4]),.b(q2[4]),.Bin(carry3[3]),.diff(l[4]),.Bout(carry3[4]));
    full_subtractor fs305(.a(p[5]),.b(q2[5]),.Bin(carry3[4]),.diff(l[5]),.Bout(carry3[5]));
    full_subtractor fs306(.a(p[6]),.b(q2[6]),.Bin(carry3[5]),.diff(l[6]),.Bout(carry3[6]));
    half_subtractor fs307(.a(p[7]),.b(carry3[6]),.diff(l[7]),.Bout());
    
    //assign final={l,{8{1'b0}}}+rhs;
    
    wire [6:0] carry4;
    
    assign final[0]=out8[0];
    assign final[1]=out8[1];
    assign final[2]=out8[2];
    assign final[3]=out8[3];
    assign final[4]=out8[4];
    assign final[5]=out8[5];
    assign final[6]=out8[6];
    assign final[7]=out8[7];
    half_adder ha400(.a(l[0]),.b(out8[8]),.sum(final[8]),.carry(carry4[0]));
    full_adder fa401(.a(l[1]),.b(out8[9]),.cin(carry4[0]),.sum(final[9]),.carry(carry4[1]));
    full_adder fa402(.a(l[2]),.b(out8[10]),.cin(carry4[1]),.sum(final[10]),.carry(carry4[2]));
    full_adder fa403(.a(l[3]),.b(out8[11]),.cin(carry4[2]),.sum(final[11]),.carry(carry4[3]));
    full_adder fa404(.a(l[4]),.b(out8[12]),.cin(carry4[3]),.sum(final[12]),.carry(carry4[4]));
    full_adder fa405(.a(l[5]),.b(out8[13]),.cin(carry4[4]),.sum(final[13]),.carry(carry4[5]));
    half_adder ha406(.a(l[6]),.b(carry4[5]),.sum(final[14]),.carry(carry4[6]));
    half_adder ha407(.a(l[7]),.b(carry4[6]),.sum(final[15]),.carry());
    
endmodule`}</code></pre>
              </div>
            )}

            {codeSubTab === 'verilog' && (
              <div className="code-block-container">
                <h3>Verilog Hardware Implementation</h3>
                <pre><code>{`module half_subtractor(
    input a,b,
    output diff,Bout
);
    assign diff=a^b;
    wire x;
    assign x=~a;
    assign Bout=x&b;
endmodule

module full_subtractor(
    input a,b,Bin,
    output diff,Bout
);
    wire in1,in2,in3,in4,in5;
    wire x;
    assign x=~a;
    assign in1=a^b;
    assign diff=in1^Bin;
    assign in2=x&b;
    assign in3=b&Bin;
    assign in4=x&Bin;
    assign in5=in2|in3;
    assign Bout=in4|in5;   
endmodule

module half_adder(
    input wire a,b,
    output wire sum,carry
    );    
    assign sum=a^b;
    assign carry=a&b;    
endmodule

module full_adder(
    input wire a,b,cin,
    output wire sum,carry
    );    
    wire in1,in2,in3,in4,in5;
    assign in1=a^b;
    assign sum=in1^cin;
    assign in2=a&b;
    assign in3=b&cin;
    assign in4=a&cin;
    assign in5=in2|in3;
    assign carry=in4|in5;    
endmodule

module nik(
    //input clk,
    input [7:0]p,q,
    output [15:0] final//,re
    );
    //assign re=p*q;
    wire [7:0] qbar;
    wire [7:0] pbar;
    assign qbar=~q;
    assign pbar=~p;
    
    //2's compliment of p
    
    wire [6:0] p2;
    wire [5:0] carry1;
    
    half_adder ha100(.a(pbar[0]),.b(1'b1),.sum(p2[0]),.carry(carry1[0]));
    half_adder ha101(.a(pbar[1]),.b(carry1[0]),.sum(p2[1]),.carry(carry1[1]));
    half_adder ha102(.a(pbar[2]),.b(carry1[1]),.sum(p2[2]),.carry(carry1[2]));
    half_adder ha103(.a(pbar[3]),.b(carry1[2]),.sum(p2[3]),.carry(carry1[3]));
    half_adder ha104(.a(pbar[4]),.b(carry1[3]),.sum(p2[4]),.carry(carry1[4]));
    half_adder ha105(.a(pbar[5]),.b(carry1[4]),.sum(p2[5]),.carry(carry1[5]));
    half_adder ha106(.a(pbar[6]),.b(carry1[5]),.sum(p2[6]),.carry());
    
    //2's compliment of q
    
    wire [6:0] q2;
    wire [5:0] carry2;
    
    half_adder ha200(.a(qbar[0]),.b(1'b1),.sum(q2[0]),.carry(carry2[0]));
    half_adder ha201(.a(qbar[1]),.b(carry2[0]),.sum(q2[1]),.carry(carry2[1]));
    half_adder ha202(.a(qbar[2]),.b(carry2[1]),.sum(q2[2]),.carry(carry2[2]));
    half_adder ha203(.a(qbar[3]),.b(carry2[2]),.sum(q2[3]),.carry(carry2[3]));
    half_adder ha204(.a(qbar[4]),.b(carry2[3]),.sum(q2[4]),.carry(carry2[4]));
    half_adder ha205(.a(qbar[5]),.b(carry2[4]),.sum(q2[5]),.carry(carry2[5]));
    half_adder ha206(.a(qbar[6]),.b(carry2[5]),.sum(q2[6]),.carry());
    
    //rhs
    //wire [13:0] rhs;
    //assign rhs=p2*q2;
    
    //square of out6[6:0]
    
    wire mul[6:0][6:0];
    genvar i1,j1;
    generate 
        for(i1=0;i1<7;i1=i1+1) begin
            for(j1=0;j1<7;j1=j1+1) begin
                 assign mul[i1][j1]=p2[j1]&q2[i1];
            end
        end
    endgenerate   
    
    wire out8[13:0];
    
    assign out8[0]=mul[0][0];
    
    wire inb3[15:0];
    wire incar4[15:0];
    
    half_adder ha900(.a(mul[0][1]),.b(mul[1][0]),.sum(inb3[0]),.carry(incar4[0]));
    full_adder fa901(.a(mul[0][2]),.b(mul[1][1]),.cin(mul[2][0]),.sum(inb3[1]),.carry(incar4[1]));
    full_adder fa902(.a(mul[0][3]),.b(mul[1][2]),.cin(mul[2][1]),.sum(inb3[2]),.carry(incar4[2]));
    full_adder fa903(.a(mul[0][4]),.b(mul[1][3]),.cin(mul[2][2]),.sum(inb3[3]),.carry(incar4[3]));
    half_adder ha904(.a(mul[3][1]),.b(mul[4][0]),.sum(inb3[4]),.carry(incar4[4]));
    full_adder fa905(.a(mul[0][5]),.b(mul[1][4]),.cin(mul[2][3]),.sum(inb3[5]),.carry(incar4[5]));
    full_adder fa906(.a(mul[3][2]),.b(mul[4][1]),.cin(mul[5][0]),.sum(inb3[6]),.carry(incar4[6]));
    full_adder fa907(.a(mul[0][6]),.b(mul[1][5]),.cin(mul[2][4]),.sum(inb3[7]),.carry(incar4[7]));
    full_adder fa908(.a(mul[3][3]),.b(mul[4][2]),.cin(mul[5][1]),.sum(inb3[8]),.carry(incar4[8]));
    full_adder fa909(.a(mul[1][6]),.b(mul[2][5]),.cin(mul[3][4]),.sum(inb3[9]),.carry(incar4[9]));
    full_adder fa910(.a(mul[4][3]),.b(mul[5][2]),.cin(mul[6][1]),.sum(inb3[10]),.carry(incar4[10]));
    full_adder fa911(.a(mul[2][6]),.b(mul[3][5]),.cin(mul[4][4]),.sum(inb3[11]),.carry(incar4[11]));
    half_adder ha912(.a(mul[5][3]),.b(mul[6][2]),.sum(inb3[12]),.carry(incar4[12]));
    full_adder fa913(.a(mul[3][6]),.b(mul[4][5]),.cin(mul[5][4]),.sum(inb3[13]),.carry(incar4[13]));
    full_adder fa914(.a(mul[4][6]),.b(mul[5][5]),.cin(mul[6][4]),.sum(inb3[14]),.carry(incar4[14]));
    half_adder ha915(.a(mul[5][6]),.b(mul[6][5]),.sum(inb3[15]),.carry(incar4[15]));
    
    assign out8[1]=inb3[0];
    
    wire inb4[11:0];
    wire incar5[11:0];
    
    half_adder hax100(.a(incar4[0]),.b(inb3[1]),.sum(inb4[0]),.carry(incar5[0]));
    full_adder fax101(.a(incar4[1]),.b(inb3[2]),.cin(mul[3][0]),.sum(inb4[1]),.carry(incar5[1]));
    full_adder fax102(.a(incar4[2]),.b(inb3[3]),.cin(inb3[4]),.sum(inb4[2]),.carry(incar5[2]));
    full_adder fax103(.a(incar4[3]),.b(incar4[4]),.cin(inb3[5]),.sum(inb4[3]),.carry(incar5[3]));
    full_adder fax104(.a(incar4[5]),.b(incar4[6]),.cin(inb3[7]),.sum(inb4[4]),.carry(incar5[4]));
    half_adder hax105(.a(inb3[8]),.b(mul[6][0]),.sum(inb4[5]),.carry(incar5[5]));
    full_adder fax106(.a(incar4[7]),.b(incar4[8]),.cin(inb3[9]),.sum(inb4[6]),.carry(incar5[6]));
    full_adder fax107(.a(incar4[9]),.b(incar4[10]),.cin(inb3[11]),.sum(inb4[7]),.carry(incar5[7]));
    full_adder fax108(.a(incar4[11]),.b(incar4[12]),.cin(inb3[13]),.sum(inb4[8]),.carry(incar5[8]));
    half_adder hax109(.a(incar4[13]),.b(inb3[14]),.sum(inb4[9]),.carry(incar5[9]));
    half_adder hax110(.a(incar4[14]),.b(inb3[15]),.sum(inb4[10]),.carry(incar5[10]));
    half_adder hax111(.a(incar4[15]),.b(mul[6][6]),.sum(inb4[11]),.carry(incar5[11]));
    
    assign out8[2]=inb4[0];
    
    wire inb5[9:0];
    wire incar6[9:0];
    
    half_adder hax200(.a(incar5[0]),.b(inb4[1]),.sum(inb5[0]),.carry(incar6[0]));
    full_adder fax201(.a(incar5[1]),.b(inb4[2]),.cin(incar6[0]),.sum(inb5[1]),.carry(incar6[1]));
    full_adder fax202(.a(incar5[2]),.b(inb4[3]),.cin(inb3[6]),.sum(inb5[2]),.carry(incar6[2]));
    full_adder fax203(.a(incar5[3]),.b(inb4[4]),.cin(inb4[5]),.sum(inb5[3]),.carry(incar6[3]));
    full_adder fax204(.a(incar5[4]),.b(incar5[5]),.cin(inb4[6]),.sum(inb5[4]),.carry(incar6[4]));
    full_adder fax205(.a(incar5[6]),.b(inb4[7]),.cin(inb3[12]),.sum(inb5[5]),.carry(incar6[5]));
    full_adder fax206(.a(incar5[7]),.b(inb4[8]),.cin(mul[6][3]),.sum(inb5[6]),.carry(incar6[6]));
    half_adder hax207(.a(incar5[8]),.b(inb4[9]),.sum(inb5[7]),.carry(incar6[7]));
    half_adder hax208(.a(incar5[9]),.b(inb4[10]),.sum(inb5[8]),.carry(incar6[8]));
    half_adder hax209(.a(incar5[10]),.b(inb4[11]),.sum(inb5[9]),.carry(incar6[9]));
    
    assign out8[3]=inb5[0];
    assign out8[4]=inb5[1];
    
    wire inb6[8:0];
    wire incar7[7:0];
    
    half_adder hax300(.a(incar6[1]),.b(inb5[2]),.sum(inb6[0]),.carry(incar7[0]));
    full_adder fax301(.a(incar6[2]),.b(inb5[3]),.cin(incar7[0]),.sum(inb6[1]),.carry(incar7[1]));
    full_adder fax302(.a(incar6[3]),.b(inb5[4]),.cin(inb3[10]),.sum(inb6[2]),.carry(incar7[2]));
    half_adder hax303(.a(incar6[4]),.b(inb5[5]),.sum(inb6[3]),.carry(incar7[3]));
    half_adder hax304(.a(incar6[5]),.b(inb5[6]),.sum(inb6[4]),.carry(incar7[4]));
    half_adder hax305(.a(incar6[6]),.b(inb5[7]),.sum(inb6[5]),.carry(incar7[5]));
    half_adder hax306(.a(incar6[7]),.b(inb5[8]),.sum(inb6[6]),.carry(incar7[6]));
    half_adder hax307(.a(incar6[8]),.b(inb5[9]),.sum(inb6[7]),.carry(incar7[7]));
    half_adder hax308(.a(incar6[9]),.b(incar5[11]),.sum(inb6[8]),.carry());
    
    assign out8[5]=inb6[0];
    assign out8[6]=inb6[1];
    
    wire incar8[5:0];
    
    half_adder hax400(.a(incar7[1]),.b(inb6[2]),.sum(out8[7]),.carry(incar8[0]));
    full_adder fax401(.a(incar7[2]),.b(inb6[3]),.cin(incar8[0]),.sum(out8[8]),.carry(incar8[1]));
    full_adder fax402(.a(incar7[3]),.b(inb6[4]),.cin(incar8[1]),.sum(out8[9]),.carry(incar8[2]));
    full_adder fax403(.a(incar7[4]),.b(inb6[5]),.cin(incar8[2]),.sum(out8[10]),.carry(incar8[3]));
    full_adder fax404(.a(incar7[5]),.b(inb6[6]),.cin(incar8[3]),.sum(out8[11]),.carry(incar8[4]));
    full_adder fax405(.a(incar7[6]),.b(inb6[7]),.cin(incar8[4]),.sum(out8[12]),.carry(incar8[5]));
    full_adder fax406(.a(incar7[7]),.b(inb6[8]),.cin(incar8[5]),.sum(out8[13]),.carry());
    
    //p - q2
    
    wire [7:0] l;
    wire [6:0] carry3;
    half_subtractor hs300(.a(p[0]),.b(q2[0]),.diff(l[0]),.Bout(carry3[0]));
    full_subtractor fs301(.a(p[1]),.b(q2[1]),.Bin(carry3[0]),.diff(l[1]),.Bout(carry3[1]));
    full_subtractor fs302(.a(p[2]),.b(q2[2]),.Bin(carry3[1]),.diff(l[2]),.Bout(carry3[2]));
    full_subtractor fs303(.a(p[3]),.b(q2[3]),.Bin(carry3[2]),.diff(l[3]),.Bout(carry3[3]));
    full_subtractor fs304(.a(p[4]),.b(q2[4]),.Bin(carry3[3]),.diff(l[4]),.Bout(carry3[4]));
    full_subtractor fs305(.a(p[5]),.b(q2[5]),.Bin(carry3[4]),.diff(l[5]),.Bout(carry3[5]));
    full_subtractor fs306(.a(p[6]),.b(q2[6]),.Bin(carry3[5]),.diff(l[6]),.Bout(carry3[6]));
    half_subtractor fs307(.a(p[7]),.b(carry3[6]),.diff(l[7]),.Bout());
    
    //assign final={l,{8{1'b0}}}+rhs;
    
    wire [6:0] carry4;
    
    assign final[0]=out8[0];
    assign final[1]=out8[1];
    assign final[2]=out8[2];
    assign final[3]=out8[3];
    assign final[4]=out8[4];
    assign final[5]=out8[5];
    assign final[6]=out8[6];
    assign final[7]=out8[7];
    half_adder ha400(.a(l[0]),.b(out8[8]),.sum(final[8]),.carry(carry4[0]));
    full_adder fa401(.a(l[1]),.b(out8[9]),.cin(carry4[0]),.sum(final[9]),.carry(carry4[1]));
    full_adder fa402(.a(l[2]),.b(out8[10]),.cin(carry4[1]),.sum(final[10]),.carry(carry4[2]));
    full_adder fa403(.a(l[3]),.b(out8[11]),.cin(carry4[2]),.sum(final[11]),.carry(carry4[3]));
    full_adder fa404(.a(l[4]),.b(out8[12]),.cin(carry4[3]),.sum(final[12]),.carry(carry4[4]));
    full_adder fa405(.a(l[5]),.b(out8[13]),.cin(carry4[4]),.sum(final[13]),.carry(carry4[5]));
    half_adder ha406(.a(l[6]),.b(carry4[5]),.sum(final[14]),.carry(carry4[6]));
    half_adder ha407(.a(l[7]),.b(carry4[6]),.sum(final[15]),.carry());
    
endmodule

module asterion(
    input [7:0] data,
    input clk,valid,rst,r_en,
    output reg done_s, edge_valid, edge_out
);
(* dont_touch = "true" *)(* ram_style = "block" *) reg [7:0]image[65535:0];
(* dont_touch = "true" *)reg [7:0] row,col;
(* dont_touch = "true" *)reg [7:0] row_m,col_m;
(* dont_touch = "true" *)reg [23:0] mean1;
(* dont_touch = "true" *)reg done_m;
wire [7:0] mean2;
(* dont_touch = "true" *)reg [7:0] row_sd,col_sd;
(* dont_touch = "true" *)reg [31:0] SD1;
(* dont_touch = "true" *)reg done_v,done_sd;
(* dont_touch = "true" *)reg[7:0] img;
(* dont_touch = "true" *)reg [7:0] row_nik,col_nik;
(* dont_touch = "true" *)reg done_nik;
(* dont_touch = "true" *)reg d;
(* dont_touch = "true" *)reg [7:0] row_s,col_s;
(* dont_touch = "true" *)reg done_w;
(* dont_touch = "true" *)reg r_en1;
(* dont_touch = "true" *)reg [7:0] row_o,col_o;
(* dont_touch = "true" *)reg done_o;
(* dont_touch = "true" *)reg t,v;
always@(posedge clk) begin
    if(rst) begin
        row<=8'd0;
        col<=8'd0;
        row_m<=8'd0;
        col_m<=8'd0;
        mean1<=24'd0;
        done_m<=1'b0;
        row_sd<=8'd0;
        col_sd<=8'd0;
        SD1<=32'd0;
        done_v<=1'b0;
        done_sd<=1'b0;
        img[7:0]<=8'd0;
        row_nik<=1'b0;
        col_nik<=1'b0;
        done_nik<=1'b0;
        d<=1'b0;
        row_s<=8'd0;
        col_s<=8'd0;
        done_s<=1'b0;
        done_w<=1'b0;
        edge_valid<=1'b0;
        edge_out<=1'b0;
        r_en1<=1'b0;
        row_o[7:0]<=8'd0;
        col_o[7:0]<=8'd0;
        done_o<=1'b0;
        t<=1'b0;
        v<=1'b0;
    end
    else if(valid) begin
            if(!done_w) begin                
                image[{row,col}] <= data;
                if (row == 8'd255 && col == 8'd255) begin
                    done_w <= 1'b1;
                end
                else if (col == 8'd255) begin
                    col <= 8'd0;
                    row <= row + 1'b1;
                end
                else begin
                    col <= col + 1'b1;
                end
        end
    end
end

always@(posedge clk) begin
    if(done_w) begin
        mean1<=image[{row_m,col_m}]+mean1;
        if (row_m == 8'd255 && col_m == 8'd255) begin
            done_m <= 1'b1;
        end
        else if (col_m == 8'd255) begin
            col_m <= 8'd0;
            row_m <= row_m + 1'b1;
        end
        else begin
            col_m <= col_m + 1'b1;
        end
    end
end
assign mean2=mean1>>16;

always@(posedge clk) begin
    if(done_m) begin
        if(mean2>image[{row_sd,col_sd}]) SD1<=((mean2-image[{row_sd,col_sd}])*(mean2-image[{row_sd,col_sd}]))+SD1;
        else SD1<=((image[{row_sd,col_sd}]-mean2)*(image[{row_sd,col_sd}]-mean2))+SD1;
        if (row_sd == 8'd255 && col_sd == 8'd255) begin
            done_v <= 1'b1;
        end
        else if (col_sd == 8'd255) begin
            col_sd <= 8'd0;
            row_sd <= row_sd + 1'b1;
        end
        else begin
            col_sd <= col_sd + 1'b1;
        end
    end
end
wire [15:0] SD2;
assign SD2=SD1>>16;
wire [7:0] black;
assign black=(SD2<16'd1225)?8'd31:(SD2>=16'd1225 && SD2<16'd4900)?8'd59:8'd87;
wire [15:0] ni;
nik nik1(.p(black),.q(img),.final(ni));

always@(posedge clk) begin
    if(done_v) begin
        d<=1'b1;
        img<=image[{row_nik,col_nik}];
        if (row_nik == 8'd255 && col_nik == 8'd255) begin
            done_nik <= 1'b1;
        end
        else if (col_nik == 8'd255) begin
            col_nik <= 8'd0;
            row_nik <= row_nik + 1'b1;
        end
        else begin
            col_nik <= col_nik + 1'b1;
        end
    end
end

(* dont_touch = "true" *) (* ram_style = "block" *) reg i[65535:0];
always@(posedge clk) begin
    if(d) begin
        if(ni<16'd2047) i[{row_s,col_s}]<=1'b0;
        else i[{row_s,col_s}]<=1'b1;
        if (row_s == 8'd255 && col_s == 8'd255) begin
            done_s <= 1'b1;
        end
        else if (col_s == 8'd255) begin
            col_s <= 8'd0;
            row_s <= row_s + 1'b1;
        end
        else begin
            col_s <= col_s + 1'b1;
        end
    end
end

always@(posedge clk) begin
    r_en1<=r_en;
    t<=r_en && !r_en1;
    if(t) begin
        v<=1'b1;
        row_o<=8'd0;
        col_o<=8'd0;
        done_o<=1'b0;
    end
    if(done_o) begin
        edge_valid<=1'b0;
        edge_out<=1'b0;
    end
    else if(v) begin
        edge_valid<=1'b1;
        edge_out<=i[{row_o,col_o}];
        if (row_o == 8'd255 && col_o == 8'd255) begin
            done_o <= 1'b1;
            v<=1'b0;
        end
        else if (col_o == 8'd255) begin
            col_o <= 8'd0;
            row_o <= row_o + 1'b1;
        end
        else begin
            col_o <= col_o + 1'b1;
        end
    end
end

endmodule
`}</code></pre>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
