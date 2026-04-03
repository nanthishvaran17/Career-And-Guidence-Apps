/**
 * Utility to verify the genuineness of educational certificates based on domain trust.
 */

export const TRUSTED_DOMAINS = [
  'udemy.com',
  'coursera.org',
  'linkedin.com',
  'edx.org',
  'nptel.ac.in',
  'swayam.gov.in',
  'tata.com',
  'ibm.com',
  'google.com',
  'microsoft.com',
  'oracle.com',
  'aws.amazon.com',
  'skillsoft.com',
  'simplilearn.com',
  'greatlearning.in',
  'upgrad.com',
  'internshala.com'
];

export type VerificationStatus = 'GENUINE' | 'SUSPICIOUS' | 'PENDING';

export const verifyCertificateLink = (url: string): { status: VerificationStatus, reason: string } => {
  if (!url || url.trim() === '') return { status: 'PENDING', reason: 'No link provided' };
  
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    const isTrusted = TRUSTED_DOMAINS.some(d => domain.includes(d));
    
    if (isTrusted) {
      return { status: 'GENUINE', reason: `Verified via trusted provider: ${domain}` };
    }
    
    // Check for common drive/file hosts which are neutral
    if (domain.includes('drive.google.com') || domain.includes('dropbox.com')) {
      return { status: 'PENDING', reason: 'Self-hosted file. Needs manual review.' };
    }

    return { status: 'SUSPICIOUS', reason: 'Unknown or unverified domain source.' };
  } catch (e) {
    return { status: 'SUSPICIOUS', reason: 'Invalid or broken URL format.' };
  }
};
