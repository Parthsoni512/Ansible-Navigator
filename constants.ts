
import { CurriculumTopic } from './types';

export const CURRICULUM: CurriculumTopic[] = [
  {
    title: '1. Introduction to Ansible',
    subtopics: [
      'What is Ansible?',
      'Key Concepts: Control Node, Managed Nodes, Inventory',
      'How Ansible Works: SSH & WinRM',
      'Ansible vs. Other Tools (Puppet, Chef)',
    ],
  },
  {
    title: '2. Setup and Configuration',
    subtopics: [
      'Installing Ansible on the Control Node',
      'Creating an Inventory File (Static & Dynamic)',
      'Ansible Configuration File (ansible.cfg)',
      'Testing Connectivity with Ad-Hoc Commands',
    ],
  },
  {
    title: '3. Ansible Playbooks',
    subtopics: [
      'Introduction to Playbooks',
      'YAML Syntax Basics',
      'Writing Your First Playbook',
      'Common Modules (apt, yum, copy, template)',
      'Running Playbooks',
    ],
  },
  {
    title: '4. Variables and Facts',
    subtopics: [
      'Using Variables in Playbooks',
      'Variable Precedence',
      'Ansible Facts',
      'Registered Variables',
    ],
  },
  {
    title: '5. Organizing Content: Roles',
    subtopics: [
      'Introduction to Roles',
      'Role Directory Structure',
      'Creating and Using Roles',
      'Finding Roles on Ansible Galaxy',
    ],
  },
  {
    title: '6. Advanced Topics',
    subtopics: [
      'Handlers and Templates (Jinja2)',
      'Conditional Execution (when)',
      'Loops (loop, with_items)',
      'Error Handling',
    ],
  },
  {
    title: '7. Security and Best Practices',
    subtopics: [
      'Using Ansible Vault for Secrets',
      'Best Practices for Playbook Design',
      'Idempotency in Playbooks',
      'Organizing Your Ansible Project',
    ],
  },
];
