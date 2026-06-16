import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronDown, ChevronRight, GripVertical, User, FileText, Briefcase, GraduationCap, Wrench, FolderGit2, Award, PlusSquare } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import PersonalInfo from './PersonalInfo';
import SummarySection from './SummarySection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import CertificationsSection from './CertificationsSection';
import CustomSectionEditor from './CustomSectionEditor';

const SECTION_META = {
  personalInfo:   { label: 'Personal Info',    icon: User,        component: PersonalInfo },
  summary:        { label: 'Summary',           icon: FileText,    component: SummarySection },
  experience:     { label: 'Experience',        icon: Briefcase,   component: ExperienceSection },
  education:      { label: 'Education',         icon: GraduationCap, component: EducationSection },
  skills:         { label: 'Skills',            icon: Wrench,      component: SkillsSection },
  projects:       { label: 'Projects',          icon: FolderGit2,  component: ProjectsSection },
  certifications: { label: 'Certifications',    icon: Award,       component: CertificationsSection },
  customSection:  { label: 'Custom Section',    icon: PlusSquare,  component: CustomSectionEditor },
};

export default function EditorPanel({ resumeId }) {
  const { sections, updateSection } = useResumeStore();
  const order = sections?.sectionOrder || Object.keys(SECTION_META);
  const [open, setOpen] = useState({ personalInfo: true, summary: true, experience: true });

  const toggle = (key) => setOpen(o => ({ ...o, [key]: !o[key] }));

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newOrder = Array.from(order);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    updateSection('sectionOrder', newOrder);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Resume Editor</h2>
        <p className="text-xs text-slate-400 mt-0.5">Drag sections to reorder</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {order.map((key, index) => {
                const meta = SECTION_META[key];
                if (!meta) return null;
                const Icon = meta.icon;
                const Component = meta.component;
                const isOpen = !!open[key];

                return (
                  <Draggable key={key} draggableId={key} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white dark:bg-slate-900 ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary-400 rounded-xl' : ''}`}
                      >
                        {/* Section Header */}
                        <div className="section-header" onClick={() => toggle(key)}>
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps} className="text-slate-300 dark:text-slate-600 hover:text-primary-400 cursor-grab active:cursor-grabbing">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                              <Icon className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{meta.label}</span>
                          </div>
                          {isOpen
                            ? <ChevronDown className="w-4 h-4 text-slate-400" />
                            : <ChevronRight className="w-4 h-4 text-slate-400" />
                          }
                        </div>

                        {/* Section Content */}
                        {isOpen && (
                          <div className="px-4 pb-4 animate-fade-in">
                            <Component resumeId={resumeId} />
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
