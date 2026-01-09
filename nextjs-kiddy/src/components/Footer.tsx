import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Kiddy Learning Hub</h3>
          <p>Educational games designed specifically for kindergarten children ages 3-6. Our interactive learning platform helps children develop essential skills in alphabet recognition, number counting, shape identification, and color learning.</p>
        </div>
        <div className="footer-section">
          <h3>Educational Features</h3>
          <ul>
            <li>26 ABC Letters with Phonics</li>
            <li>Numbers 1-100 with Counting</li>
            <li>10 Geometric Shapes</li>
            <li>12 Vibrant Colors</li>
            <li>Interactive Learning Games</li>
            <li>Progress Tracking</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Children Ages 3-6</li>
            <li>Family Learning Time</li>
            <li>Parental Supervision</li>
            <li>Screen Time Guidelines</li>
            <li>Privacy Protected</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Kiddy Learning Hub. Educational games for children. All rights reserved.</p>
        <div className="footer-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};