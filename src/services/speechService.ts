import { LanguageMode } from '../types';

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
}

export class SpeechEngine {
  private recognition: any = null;
  private isListening = false;
  private currentLanguage: LanguageMode = 'en';
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      }

      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
        this.loadVoices();
        if (this.synthesis.onvoiceschanged !== undefined) {
          this.synthesis.onvoiceschanged = () => this.loadVoices();
        }
      }
    }
  }

  private loadVoices() {
    if (!this.synthesis) return;
    this.voices = this.synthesis.getVoices();
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setLanguage(lang: LanguageMode) {
    this.currentLanguage = lang;
    if (this.recognition) {
      if (lang === 'ta') {
        this.recognition.lang = 'ta-IN';
      } else if (lang === 'tanglish') {
        // Tanglish is usually spoken mixed Tamil/English; 'en-IN' or 'ta-IN' works best
        this.recognition.lang = 'en-IN';
      } else {
        this.recognition.lang = 'en-US';
      }
    }
  }

  public startListening(callbacks: SpeechRecognitionCallbacks) {
    if (!this.recognition) {
      callbacks.onError?.(
        'Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.'
      );
      return;
    }

    if (this.isListening) {
      return;
    }

    this.setLanguage(this.currentLanguage);

    this.recognition.onstart = () => {
      this.isListening = true;
      callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      const activeText = finalTranscript || interimTranscript;
      callbacks.onResult?.(activeText, Boolean(finalTranscript));
    };

    this.recognition.onerror = (event: any) => {
      let errorMsg = 'Microphone or recognition error.';
      if (event.error === 'not-allowed') {
        errorMsg = 'Microphone permission denied. Please allow microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        errorMsg = 'No speech detected. Please speak into your microphone.';
      } else if (event.error === 'network') {
        errorMsg = 'Network error during speech recognition.';
      }
      callbacks.onError?.(errorMsg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd?.();
    };

    try {
      this.recognition.start();
    } catch (err: unknown) {
      const error = err as Error;
      callbacks.onError?.(error.message);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      voice?: SpeechSynthesisVoice;
      onBoundary?: (charIndex: number, charLength: number) => void;
      onEnd?: () => void;
    }
  ) {
    if (!this.synthesis || !text.trim()) return;

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;

    // Select suitable voice
    if (options?.voice) {
      utterance.voice = options.voice;
    } else {
      const isTamil = /[\u0B80-\u0BFF]/.test(text) || this.currentLanguage === 'ta';
      const suitableVoice = this.voices.find(v => {
        if (isTamil) {
          return v.lang.startsWith('ta');
        }
        return v.lang.includes('en-IN') || v.lang.includes('en-US');
      });
      if (suitableVoice) {
        utterance.voice = suitableVoice;
      }
    }

    if (options?.onBoundary) {
      utterance.onboundary = (e: any) => {
        if (e.name === 'word' || e.name === 'sentence') {
          options.onBoundary?.(e.charIndex, e.charLength || 1);
        }
      };
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    this.synthesis.speak(utterance);
  }

  public pauseSpeaking() {
    if (this.synthesis && this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  public resumeSpeaking() {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  public stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return Boolean(this.synthesis && this.synthesis.speaking);
  }

  public isPaused(): boolean {
    return Boolean(this.synthesis && this.synthesis.paused);
  }
}

export const speechEngine = new SpeechEngine();
