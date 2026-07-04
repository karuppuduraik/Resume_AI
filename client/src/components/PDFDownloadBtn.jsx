import React, { useState, useEffect } from 'react';
import { 
  PDFDownloadLink, Document, Page, Text, View, StyleSheet 
} from '@react-pdf/renderer';
import { FaDownload, FaSpinner } from 'react-icons/fa';

// React PDF stylesheets for each template layout
const modernStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#2D2D2D' },
  header: { borderBottomWidth: 1.5, borderBottomColor: '#B97A56', paddingBottom: 12, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#1E1E1E' },
  title: { fontSize: 10, color: '#B97A56', marginTop: 2, textTransform: 'uppercase', fontWeight: 'bold' },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, fontSize: 8, color: '#666666' },
  contactItem: { marginRight: 12 },
  body: { flexDirection: 'row' },
  mainCol: { flex: 2, paddingRight: 15 },
  sideCol: { flex: 1, borderLeftWidth: 1, borderLeftColor: '#ECECEC', paddingLeft: 15 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#B97A56', textTransform: 'uppercase', marginBottom: 8, marginTop: 12 },
  summaryText: { fontSize: 8.5, color: '#444444', lineHeight: 1.3 },
  itemBlock: { marginBottom: 8 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold' },
  itemSubHeader: { fontSize: 8.5, fontWeight: 'semibold', color: '#444444', marginTop: 1 },
  itemDesc: { fontSize: 7.5, color: '#555555', marginTop: 3, lineHeight: 1.25 },
  skillContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  skillBadge: { backgroundColor: '#F5F5F5', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 2, marginBottom: 3, marginRight: 3, fontSize: 7.5 },
  eduBlock: { marginBottom: 6 },
});

const minimalStyles = StyleSheet.create({
  page: { padding: 45, fontFamily: 'Times-Roman', fontSize: 9.5, color: '#333333' },
  header: { alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#CCCCCC', paddingBottom: 15, marginBottom: 20 },
  name: { fontSize: 22, color: '#111111', textTransform: 'uppercase', letterSpacing: 1 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 6, fontSize: 8, color: '#777777', gap: 10 },
  sectionRow: { flexDirection: 'row', marginTop: 12, borderBottomWidth: 0.5, borderBottomColor: '#EAEAEA', paddingBottom: 8 },
  sectionLabel: { width: 90, fontSize: 8, fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionContent: { flex: 1 },
  summaryText: { fontSize: 9, color: '#444444', lineHeight: 1.35 },
  itemBlock: { marginBottom: 8 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold', color: '#111111' },
  itemSubHeader: { fontSize: 8.5, color: '#666666', fontStyle: 'italic', marginTop: 1 },
  itemDesc: { fontSize: 8.5, color: '#444444', marginTop: 3, lineHeight: 1.3 },
  skillString: { fontSize: 9, color: '#333333', lineHeight: 1.3 },
  eduBlock: { marginBottom: 6 },
});

const overleafStyles = StyleSheet.create({
  page: { padding: 35, fontFamily: 'Helvetica', fontSize: 9.5, color: '#333333' },
  header: { borderBottomWidth: 1.5, borderBottomColor: '#2B6CB0', paddingBottom: 10, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: 20, color: '#2B6CB0', fontWeight: 'bold' },
  title: { fontSize: 9, color: '#4A5568', marginTop: 2, fontWeight: 'medium' },
  contactRow: { flexDirection: 'column', alignItems: 'flex-end', fontSize: 8, color: '#4A5568', gap: 2 },
  body: { flexDirection: 'row', gap: 15 },
  leftCol: { width: '30%', borderRightWidth: 0.5, borderRightColor: '#CBD5E1', paddingRight: 10 },
  rightCol: { width: '70%', paddingLeft: 10 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#2B6CB0', borderBottomWidth: 0.5, borderBottomColor: '#CBD5E1', paddingBottom: 2, textTransform: 'uppercase', marginBottom: 6, marginTop: 10 },
  summaryText: { fontSize: 8.5, color: '#4A5568', lineHeight: 1.3 },
  itemBlock: { marginBottom: 8 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold', color: '#2D3748' },
  itemSubHeader: { fontSize: 8.5, fontWeight: 'semibold', color: '#4A5568', marginTop: 1 },
  itemDesc: { fontSize: 8, color: '#4A5568', marginTop: 3, lineHeight: 1.25 },
  skillRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, borderBottomWidth: 0.5, borderBottomColor: '#F1F5F9', paddingVertical: 2 },
  eduBlock: { marginBottom: 6 },
});

// Template Renders
const ModernPDF = ({ data }) => {
  const { personalInfo = {}, summary = '', education = [], experience = [], projects = [], skills = [], certifications = [], languages = [] } = data;
  return (
    <Page size="A4" style={modernStyles.page}>
      <View style={modernStyles.header}>
        <Text style={modernStyles.name}>{personalInfo.fullName || 'Your Name'}</Text>
        <Text style={modernStyles.title}>Professional Resume</Text>
        <View style={modernStyles.contactRow}>
          {personalInfo.email && <Text style={modernStyles.contactItem}>{personalInfo.email}</Text>}
          {personalInfo.phone && <Text style={modernStyles.contactItem}>{personalInfo.phone}</Text>}
          {personalInfo.address && <Text style={modernStyles.contactItem}>{personalInfo.address}</Text>}
          {personalInfo.linkedin && <Text style={modernStyles.contactItem}>LI: {personalInfo.linkedin}</Text>}
          {personalInfo.github && <Text style={modernStyles.contactItem}>GH: {personalInfo.github}</Text>}
        </View>
      </View>
      <View style={modernStyles.body}>
        <View style={modernStyles.mainCol}>
          {summary && (
            <View>
              <Text style={modernStyles.sectionTitle}>Summary</Text>
              <Text style={modernStyles.summaryText}>{summary}</Text>
            </View>
          )}
          {experience.length > 0 && (
            <View>
              <Text style={modernStyles.sectionTitle}>Experience</Text>
              {experience.map((exp, idx) => (
                <View key={idx} style={modernStyles.itemBlock}>
                  <View style={modernStyles.itemHeader}>
                    <Text style={{ fontWeight: 'bold' }}>{exp.position}</Text>
                    <Text style={{ color: '#666666', fontSize: 8 }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
                  </View>
                  <Text style={modernStyles.itemSubHeader}>{exp.company} {exp.location ? `| ${exp.location}` : ''}</Text>
                  {exp.description && <Text style={modernStyles.itemDesc}>{exp.description}</Text>}
                </View>
              ))}
            </View>
          )}
          {projects.length > 0 && (
            <View>
              <Text style={modernStyles.sectionTitle}>Projects</Text>
              {projects.map((proj, idx) => (
                <View key={idx} style={modernStyles.itemBlock}>
                  <View style={modernStyles.itemHeader}>
                    <Text style={{ fontWeight: 'bold' }}>{proj.title} {proj.role ? `(${proj.role})` : ''}</Text>
                    {proj.link && <Text style={{ color: '#B97A56', fontSize: 8 }}>{proj.link}</Text>}
                  </View>
                  {proj.technologies && <Text style={{ fontSize: 7.5, color: '#666666', marginTop: 1 }}>Tech: {proj.technologies}</Text>}
                  {proj.description && <Text style={modernStyles.itemDesc}>{proj.description}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={modernStyles.sideCol}>
          {skills.length > 0 && (
            <View>
              <Text style={modernStyles.sectionTitle}>Skills</Text>
              <View style={modernStyles.skillContainer}>
                {skills.map((skill, idx) => (
                  <Text key={idx} style={modernStyles.skillBadge}>{skill.name}</Text>
                ))}
              </View>
            </View>
          )}
          {education.length > 0 && (
            <View>
              <Text style={modernStyles.sectionTitle}>Education</Text>
              {education.map((edu, idx) => (
                <View key={idx} style={modernStyles.eduBlock}>
                  <Text style={{ fontWeight: 'bold', fontSize: 8.5 }}>{edu.degree}</Text>
                  <Text style={{ fontSize: 7.5, color: '#444444' }}>{edu.fieldOfStudy}</Text>
                  <Text style={{ fontSize: 7.5, color: '#666666' }}>{edu.school}</Text>
                  <Text style={{ fontSize: 7, color: '#888888', marginTop: 1 }}>{edu.startDate} - {edu.endDate}</Text>
                </View>
              ))}
            </View>
          )}
          {certifications.length > 0 && (
            <View>
              <Text style={modernStyles.sectionTitle}>Certifications</Text>
              {certifications.map((cert, idx) => (
                <View key={idx} style={{ marginBottom: 5 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 7.5 }}>{cert.name}</Text>
                  <Text style={{ fontSize: 7, color: '#666666' }}>{cert.issuer} {cert.date ? `(${cert.date})` : ''}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>
  );
};

const MinimalPDF = ({ data }) => {
  const { personalInfo = {}, summary = '', education = [], experience = [], projects = [], skills = [] } = data;
  return (
    <Page size="A4" style={minimalStyles.page}>
      <View style={minimalStyles.header}>
        <Text style={minimalStyles.name}>{personalInfo.fullName || 'Your Name'}</Text>
        <View style={minimalStyles.contactRow}>
          {personalInfo.email && <Text>{personalInfo.email}</Text>}
          {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
          {personalInfo.address && <Text>{personalInfo.address}</Text>}
          {personalInfo.linkedin && <Text>{personalInfo.linkedin}</Text>}
        </View>
      </View>
      {summary && (
        <View style={minimalStyles.sectionRow}>
          <Text style={minimalStyles.sectionLabel}>Summary</Text>
          <View style={minimalStyles.sectionContent}>
            <Text style={minimalStyles.summaryText}>{summary}</Text>
          </View>
        </View>
      )}
      {experience.length > 0 && (
        <View style={minimalStyles.sectionRow}>
          <Text style={minimalStyles.sectionLabel}>Experience</Text>
          <View style={minimalStyles.sectionContent}>
            {experience.map((exp, idx) => (
              <View key={idx} style={minimalStyles.itemBlock}>
                <View style={minimalStyles.itemHeader}>
                  <Text style={{ fontWeight: 'bold' }}>{exp.company}</Text>
                  <Text style={{ color: '#666666', fontSize: 8 }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
                </View>
                <Text style={minimalStyles.itemSubHeader}>{exp.position} {exp.location ? `| ${exp.location}` : ''}</Text>
                {exp.description && <Text style={minimalStyles.itemDesc}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        </View>
      )}
      {projects.length > 0 && (
        <View style={minimalStyles.sectionRow}>
          <Text style={minimalStyles.sectionLabel}>Projects</Text>
          <View style={minimalStyles.sectionContent}>
            {projects.map((proj, idx) => (
              <View key={idx} style={minimalStyles.itemBlock}>
                <View style={minimalStyles.itemHeader}>
                  <Text style={{ fontWeight: 'bold' }}>{proj.title}</Text>
                  {proj.link && <Text style={{ fontSize: 8, color: '#777777' }}>{proj.link}</Text>}
                </View>
                {proj.technologies && <Text style={{ fontSize: 8, color: '#666666' }}>Tech: {proj.technologies}</Text>}
                {proj.description && <Text style={minimalStyles.itemDesc}>{proj.description}</Text>}
              </View>
            ))}
          </View>
        </View>
      )}
      {skills.length > 0 && (
        <View style={minimalStyles.sectionRow}>
          <Text style={minimalStyles.sectionLabel}>Skills</Text>
          <View style={minimalStyles.sectionContent}>
            <Text style={minimalStyles.skillString}>{skills.map(s => s.name).join(', ')}</Text>
          </View>
        </View>
      )}
      {education.length > 0 && (
        <View style={minimalStyles.sectionRow}>
          <Text style={minimalStyles.sectionLabel}>Education</Text>
          <View style={minimalStyles.sectionContent}>
            {education.map((edu, idx) => (
              <View key={idx} style={minimalStyles.eduBlock}>
                <View style={minimalStyles.itemHeader}>
                  <Text style={{ fontWeight: 'bold' }}>{edu.school}</Text>
                  <Text style={{ color: '#666666', fontSize: 8 }}>{edu.startDate} - {edu.endDate}</Text>
                </View>
                <Text style={minimalStyles.itemSubHeader}>{edu.degree} in {edu.fieldOfStudy}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Page>
  );
};

const OverleafPDF = ({ data }) => {
  const { personalInfo = {}, summary = '', education = [], experience = [], projects = [], skills = [], certifications = [], languages = [] } = data;
  return (
    <Page size="A4" style={overleafStyles.page}>
      <View style={overleafStyles.header}>
        <View>
          <Text style={overleafStyles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          <Text style={overleafStyles.title}>Curriculum Vitae</Text>
        </View>
        <View style={overleafStyles.contactRow}>
          {personalInfo.email && <Text>{personalInfo.email}</Text>}
          {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
          {personalInfo.linkedin && <Text>LI: {personalInfo.linkedin}</Text>}
          {personalInfo.github && <Text>GH: {personalInfo.github}</Text>}
        </View>
      </View>

      <View style={overleafStyles.body}>
        {/* Left Column - 30% */}
        <View style={overleafStyles.leftCol}>
          {education.length > 0 && (
            <View>
              <Text style={overleafStyles.sectionTitle}>Education</Text>
              {education.map((edu, idx) => (
                <View key={idx} style={{ marginBottom: 6 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 8 }}>{edu.degree}</Text>
                  <Text style={{ fontSize: 7.5, color: '#444444' }}>{edu.fieldOfStudy}</Text>
                  <Text style={{ fontSize: 7.5, color: '#666666' }}>{edu.school}</Text>
                  <Text style={{ fontSize: 7, color: '#888888', marginTop: 1 }}>{edu.startDate} - {edu.endDate}</Text>
                </View>
              ))}
            </View>
          )}

          {skills.length > 0 && (
            <View>
              <Text style={overleafStyles.sectionTitle}>Skills</Text>
              {skills.map((skill, idx) => (
                <View key={idx} style={overleafStyles.skillRow}>
                  <Text style={{ fontWeight: 'semibold', color: '#2D3748' }}>{skill.name}</Text>
                  <Text style={{ color: '#888888', fontSize: 7 }}>{skill.level}</Text>
                </View>
              ))}
            </View>
          )}

          {languages.length > 0 && (
            <View>
              <Text style={overleafStyles.sectionTitle}>Languages</Text>
              {languages.map((lang, idx) => (
                <View key={idx} style={overleafStyles.skillRow}>
                  <Text style={{ fontWeight: 'semibold', color: '#2D3748' }}>{lang.name}</Text>
                  <Text style={{ color: '#888888', fontSize: 7 }}>{lang.proficiency}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right Column - 70% */}
        <View style={overleafStyles.rightCol}>
          {summary && (
            <View>
              <Text style={overleafStyles.sectionTitle}>Statement</Text>
              <Text style={overleafStyles.summaryText}>{summary}</Text>
            </View>
          )}

          {experience.length > 0 && (
            <View>
              <Text style={overleafStyles.sectionTitle}>Experience</Text>
              {experience.map((exp, idx) => (
                <View key={idx} style={overleafStyles.itemBlock}>
                  <View style={overleafStyles.itemHeader}>
                    <Text style={{ fontWeight: 'bold' }}>{exp.position}</Text>
                    <Text style={{ color: '#666666', fontSize: 7.5 }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
                  </View>
                  <Text style={overleafStyles.itemSubHeader}>{exp.company} {exp.location ? `| ${exp.location}` : ''}</Text>
                  {exp.description && <Text style={overleafStyles.itemDesc}>{exp.description}</Text>}
                </View>
              ))}
            </View>
          )}

          {projects.length > 0 && (
            <View>
              <Text style={overleafStyles.sectionTitle}>Selected Projects</Text>
              {projects.map((proj, idx) => (
                <View key={idx} style={overleafStyles.itemBlock}>
                  <View style={overleafStyles.itemHeader}>
                    <Text style={{ fontWeight: 'bold' }}>{proj.title} {proj.role ? `(${proj.role})` : ''}</Text>
                    {proj.link && <Text style={{ color: '#2B6CB0', fontSize: 7 }}>{proj.link}</Text>}
                  </View>
                  {proj.technologies && <Text style={{ fontSize: 7, color: '#666666', marginTop: 1 }}>Tech: {proj.technologies}</Text>}
                  {proj.description && <Text style={overleafStyles.itemDesc}>{proj.description}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>
  );
};

const corporateStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#333333' },
  header: { alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#1E3A8A', paddingBottom: 12, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1E3A8A', textTransform: 'uppercase' },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 6, fontSize: 8, color: '#555555', gap: 12 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#1E3A8A', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 3, textTransform: 'uppercase', marginBottom: 8, marginTop: 12 },
  summaryText: { fontSize: 8.5, color: '#444444', lineHeight: 1.4 },
  itemBlock: { marginBottom: 10 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold', color: '#111111' },
  itemSubHeader: { fontSize: 8.5, fontWeight: 'medium', color: '#555555', marginTop: 1 },
  itemDesc: { fontSize: 8, color: '#444444', marginTop: 4, lineHeight: 1.3 },
  skillsText: { fontSize: 9, color: '#444444', lineHeight: 1.4 },
  eduBlock: { marginBottom: 8 },
});

const CorporatePDF = ({ data }) => {
  const { personalInfo = {}, summary = '', education = [], experience = [], projects = [], skills = [], certifications = [] } = data;
  return (
    <Page size="A4" style={corporateStyles.page}>
      <View style={corporateStyles.header}>
        <Text style={corporateStyles.name}>{personalInfo.fullName || 'Your Name'}</Text>
        <View style={corporateStyles.contactRow}>
          {personalInfo.email && <Text>{personalInfo.email}</Text>}
          {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
          {personalInfo.address && <Text>{personalInfo.address}</Text>}
          {personalInfo.linkedin && <Text>LI: {personalInfo.linkedin}</Text>}
        </View>
      </View>

      {summary && (
        <View>
          <Text style={corporateStyles.sectionTitle}>Professional Summary</Text>
          <Text style={corporateStyles.summaryText}>{summary}</Text>
        </View>
      )}

      {experience.length > 0 && (
        <View>
          <Text style={corporateStyles.sectionTitle}>Work Experience</Text>
          {experience.map((exp, idx) => (
            <View key={idx} style={corporateStyles.itemBlock}>
              <View style={corporateStyles.itemHeader}>
                <Text style={{ fontWeight: 'bold' }}>{exp.position}</Text>
                <Text style={{ color: '#555555', fontSize: 8 }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
              </View>
              <Text style={corporateStyles.itemSubHeader}>{exp.company} {exp.location ? `| ${exp.location}` : ''}</Text>
              {exp.description && <Text style={corporateStyles.itemDesc}>{exp.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {projects.length > 0 && (
        <View>
          <Text style={corporateStyles.sectionTitle}>Key Projects</Text>
          {projects.map((proj, idx) => (
            <View key={idx} style={corporateStyles.itemBlock}>
              <View style={corporateStyles.itemHeader}>
                <Text style={{ fontWeight: 'bold' }}>{proj.title} {proj.role ? `(${proj.role})` : ''}</Text>
                <Text style={{ color: '#555555', fontSize: 8 }}>{proj.link || ''}</Text>
              </View>
              {proj.technologies && <Text style={{ fontSize: 7.5, color: '#555555', marginTop: 1 }}>Tech: {proj.technologies}</Text>}
              {proj.description && <Text style={corporateStyles.itemDesc}>{proj.description}</Text>}
            </View>
          ))}
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 20 }}>
        {education.length > 0 && (
          <View style={{ flex: 1 }}>
            <Text style={corporateStyles.sectionTitle}>Education</Text>
            {education.map((edu, idx) => (
              <View key={idx} style={corporateStyles.eduBlock}>
                <Text style={{ fontWeight: 'bold', fontSize: 8.5 }}>{edu.degree}</Text>
                <Text style={{ fontSize: 8, color: '#444444' }}>{edu.fieldOfStudy}</Text>
                <Text style={{ fontSize: 8, color: '#666666' }}>{edu.school}</Text>
                <Text style={{ fontSize: 7, color: '#888888', marginTop: 1 }}>{edu.startDate} - {edu.endDate}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ flex: 1 }}>
          {skills.length > 0 && (
            <View>
              <Text style={corporateStyles.sectionTitle}>Key Skills</Text>
              <Text style={corporateStyles.skillsText}>{skills.map(s => s.name).join(' • ')}</Text>
            </View>
          )}

          {certifications.length > 0 && (
            <View>
              <Text style={corporateStyles.sectionTitle}>Certifications</Text>
              {certifications.map((cert, idx) => (
                <View key={idx} style={{ marginBottom: 5 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 8 }}>{cert.name}</Text>
                  <Text style={{ fontSize: 7, color: '#666666' }}>{cert.issuer} {cert.date ? `(${cert.date})` : ''}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>
  );
};

// Dynamic PDF Document Selector
const MyPDFDocument = ({ data }) => {
  const template = data.template || 'modern';
  
  if (template === 'minimal') {
    return (
      <Document>
        <MinimalPDF data={data} />
      </Document>
    );
  }
  if (template === 'overleaf') {
    return (
      <Document>
        <OverleafPDF data={data} />
      </Document>
    );
  }
  if (template === 'corporate') {
    return (
      <Document>
        <CorporatePDF data={data} />
      </Document>
    );
  }

  return (
    <Document>
      <ModernPDF data={data} />
    </Document>
  );
};

// Export button wrapper
const PDFDownloadBtn = ({ data }) => {
  const [showLink, setShowLink] = useState(false);
  const fileName = `${(data.personalInfo?.fullName || 'resume').toLowerCase().replace(/\s+/g, '_')}_resume.pdf`;

  // Reset the download link state if the data changes, so it forces recompilation on next click
  useEffect(() => {
    setShowLink(false);
  }, [data]);

  if (!showLink) {
    return (
      <button
        onClick={() => setShowLink(true)}
        className="premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass cursor-pointer flex items-center gap-2 text-sm"
      >
        <FaDownload /> Download PDF
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<MyPDFDocument data={data} />}
      fileName={fileName}
      className="premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass cursor-pointer flex items-center gap-2 text-sm font-semibold"
    >
      {({ blob, url, loading, error }) => {
        if (loading) {
          return (
            <>
              <FaSpinner className="animate-spin text-sm" /> Preparing...
            </>
          );
        }
        if (error) {
          console.error('PDF generation error:', error);
          return 'Error. Retry';
        }
        return (
          <>
            <FaDownload /> Click to Save
          </>
        );
      }}
    </PDFDownloadLink>
  );
};

export default PDFDownloadBtn;
