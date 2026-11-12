{{/*
We truncate at 63 chars - (11 + (len $suffix)) because the controller-revision-hash label adds an 11 character suffix
to the pod name, and we want the -validator suffix to still be present, but are happy to truncate the preceding name.
See https://github.com/kubernetes/kubernetes/issues/64023 for controller-revision-hash details.
*/}}
{{- define "validator.fullname" -}}
{{- $suffix := "-validator" }}
{{- include "agent-common.fullname" . | trunc (int (sub 63 (add 11 (len $suffix)))) | trimSuffix "-" }}{{ print $suffix }}
{{- end }}

{{/*
Names of the Secrets the pods mount. By default the ones the chart's own
ExternalSecrets create; `secrets.*` in the values names Secrets created some
other way (externalSecrets.enabled false), with the signing keys and the
bucket credentials in distinct Secrets.
*/}}
{{- define "agent.secret.rpcEndpoints" -}}
{{- default (printf "%s-secret" (include "agent-common.fullname" .)) .Values.secrets.rpcEndpoints }}
{{- end }}
{{- define "agent.secret.validatorKeys" -}}
{{- default (printf "%s-secret" (include "validator.fullname" .)) .Values.secrets.validatorKeys }}
{{- end }}
{{- define "agent.secret.relayerKeys" -}}
{{- default (printf "%s-relayer-secret" (include "agent-common.fullname" .)) .Values.secrets.relayerKeys }}
{{- end }}
